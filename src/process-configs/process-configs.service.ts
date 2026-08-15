import {
	Injectable,
	ConflictException,
	NotFoundException,
	BadRequestException,
	Logger,
	ServiceUnavailableException,
} from '@nestjs/common';

import { PrismaService }           from '@prisma/prisma.service';
import { CreateProcessConfigDto }  from './dto/create-process-config.dto';
import { UpdateProcessConfigDto }  from './dto/update-process-config.dto';
import { ProcessConfig }            from '@generated/prisma/client';
import { RedisCacheWarmupService } from '../cache/redis-cache-warmup.service';


@Injectable()
export class ProcessConfigsService {

	private readonly logger: Logger = new Logger( ProcessConfigsService.name );


	constructor(
		private readonly prisma                  : PrismaService,
		private readonly redisCacheWarmupService : RedisCacheWarmupService,
	) {}


	async create( createProcessConfigDto: CreateProcessConfigDto ) {
		const period = await this.prisma.period.findUnique( {
			where: { id: createProcessConfigDto.periodId }
		} );

		if ( !period ) {
			throw new NotFoundException( `Period with ID ${ createProcessConfigDto.periodId } not found` );
		}

		const exists = await this.prisma.processConfig.findUnique( {
			where: { periodId: createProcessConfigDto.periodId }
		} );

		if ( exists ) {
			throw new ConflictException( `A ProcessConfig already exists for period ${ createProcessConfigDto.periodId }` );
		}

		this.validateProcessConfigDates(
			createProcessConfigDto.planningStartDate,
			createProcessConfigDto.planningEndDate,
			createProcessConfigDto.enrollmentStartDate,
			createProcessConfigDto.enrollmentEndDate,
		);

		await this.redisCacheWarmupService.ping();

		return this.prisma.$transaction( async ( tx ) => {
			const config = await tx.processConfig.create({
				data : {
					periodId            : createProcessConfigDto.periodId,
					planningStartDate   : createProcessConfigDto.planningStartDate,
					planningEndDate     : createProcessConfigDto.planningEndDate,
					enrollmentStartDate : createProcessConfigDto.enrollmentStartDate,
					enrollmentEndDate   : createProcessConfigDto.enrollmentEndDate,
				},
			});

			await this.redisCacheWarmupService.syncPeriodQuotaToRedis( config.periodId );

			return config;
		});
	}


	// async findAll(): Promise<ProcessConfig[]> {
	async findAll() {
		const currentYear = new Date().getFullYear();
		const startOfYear = new Date( `${ currentYear }-01-01T00:00:00.000Z` );
		const endOfYear   = new Date( `${ currentYear }-12-31T23:59:59.999Z` );

		return this.prisma.processConfig.findMany( {
            select : {
                id                 : true,
                status             : true,
                totalRealStudents  : true,
                planningStartDate  : true,
                planningEndDate    : true,
                enrollmentStartDate: true,
                enrollmentEndDate  : true,
                createdAt          : true,
                updatedAt          : true,
                period             : {
                    select: {
                        id          : true,
                        name        : true,
                        startDate   : true,
                        endDate     : true,
                        status      : true,
                        type        : true
                    }
                },
            },
			where   : {
				createdAt: {
					gte : startOfYear,
					lte : endOfYear,
				}
			}
		});
	}


	async findOne( id: string ) {
		const processConfig = await this.prisma.processConfig.findUnique( {
			where   : { id },
			include : {
				period: true,
			}
		} );

		if ( !processConfig ) {
			throw new NotFoundException( `ProcessConfig with ID ${ id } not found` );
		}

		return processConfig;
	}


	async update( id: string, updateProcessConfigDto: UpdateProcessConfigDto ) {
		const processConfig = await this.prisma.processConfig.findUnique( {
			where: { id }
		} );

		if ( !processConfig ) {
			throw new NotFoundException( `ProcessConfig with ID ${ id } not found` );
		}

		if ( updateProcessConfigDto.periodId && updateProcessConfigDto.periodId !== processConfig.periodId ) {
			const periodExists = await this.prisma.period.findUnique( {
				where: { id: updateProcessConfigDto.periodId }
			} );

			if ( !periodExists ) {
				throw new NotFoundException( `Period with ID ${ updateProcessConfigDto.periodId } not found` );
			}

			const processConfigExists = await this.prisma.processConfig.findUnique( {
				where: { periodId: updateProcessConfigDto.periodId }
			} );

			if ( processConfigExists ) {
				throw new ConflictException( `A ProcessConfig already exists for period ${ updateProcessConfigDto.periodId }` );
			}
		}

		const merged = { ...processConfig, ...updateProcessConfigDto };

		this.validateProcessConfigDates(
			merged.planningStartDate,
			merged.planningEndDate,
			merged.enrollmentStartDate,
			merged.enrollmentEndDate,
		);

		await this.redisCacheWarmupService.ping();

		const oldPeriodId = processConfig.periodId;

		return this.prisma.$transaction( async ( tx ) => {
			const config = await tx.processConfig.update({
				where : { id },
				data  : {
					periodId            : updateProcessConfigDto.periodId,
					planningStartDate   : updateProcessConfigDto.planningStartDate,
					planningEndDate     : updateProcessConfigDto.planningEndDate,
					enrollmentStartDate : updateProcessConfigDto.enrollmentStartDate,
					enrollmentEndDate   : updateProcessConfigDto.enrollmentEndDate,
				},
			});

			await this.redisCacheWarmupService.syncPeriodQuotaToRedis( config.periodId );

			if ( oldPeriodId !== config.periodId ) {
				await this.redisCacheWarmupService.deletePeriodQuotasFromRedis( oldPeriodId );
			}

			return config;
		});
	}


	async remove( id: string ) {
		const processConfig = await this.prisma.processConfig.findUnique( {
			where: { id }
		} );

		if ( !processConfig ) {
			throw new NotFoundException( `ProcessConfig with ID ${ id } not found` );
		}

		if ( processConfig.status !== 'PENDING' && processConfig.status !== 'CLOSED' ) {
			throw new BadRequestException( `No se puede eliminar la configuración del proceso porque su estado actual es ${ processConfig.status }. Solo se puede eliminar en estado PENDING o CLOSED.` );
		}

		await this.redisCacheWarmupService.ping();

		return this.prisma.$transaction( async ( tx ) => {
			const config = await tx.processConfig.delete({
				where : { id },
			});

			await this.redisCacheWarmupService.deletePeriodQuotasFromRedis( config.periodId );

			return config;
		});
	}


	private validateProcessConfigDates( planningStartDate: Date, planningEndDate: Date, enrollmentStartDate: Date, enrollmentEndDate: Date ) {
		const planStartDay   = new Date( planningStartDate.getFullYear(), planningStartDate.getMonth(), planningStartDate.getDate() );
		const planEndDay     = new Date( planningEndDate.getFullYear(), planningEndDate.getMonth(), planningEndDate.getDate() );
		const enrollStartDay = new Date( enrollmentStartDate.getFullYear(), enrollmentStartDate.getMonth(), enrollmentStartDate.getDate() );
		const enrollEndDay   = new Date( enrollmentEndDate.getFullYear(), enrollmentEndDate.getMonth(), enrollmentEndDate.getDate() );

		if ( planEndDay.getTime() <= planStartDay.getTime() ) {
			throw new BadRequestException( 'La fecha de fin de planificación no puede ser menor o igual al mismo día que la fecha de inicio' );
		}

		if ( enrollStartDay.getTime() <= planEndDay.getTime() ) {
			throw new BadRequestException( 'La etapa de inscripción (enrollment) debe comenzar al menos el día siguiente del fin de planificación' );
		}

		if ( enrollEndDay.getTime() <= enrollStartDay.getTime() ) {
			throw new BadRequestException( 'La fecha de fin de inscripción (enrollment) no puede ser menor o igual al mismo día que su fecha de inicio' );
		}
	}

}
