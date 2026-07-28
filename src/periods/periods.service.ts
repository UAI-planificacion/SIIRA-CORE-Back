import {
	Injectable,
	ConflictException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';


@Injectable()
export class PeriodsService {

	constructor( private readonly prisma: PrismaService ) {}


	async create( createPeriodDto: CreatePeriodDto ) {
		const exists = await this.prisma.period.findUnique( {
			where: { id: createPeriodDto.id }
		} );

		if ( exists ) {
			throw new ConflictException( `Period with ID ${ createPeriodDto.id } already exists` );
		}

		this.validatePeriodDates(
			createPeriodDto.startDate,
			createPeriodDto.endDate,
			createPeriodDto.openingDate,
			createPeriodDto.closingDate,
		);

		return this.prisma.period.create( {
			data: {
				id           : createPeriodDto.id,
				name         : createPeriodDto.name,
				costCenterId : createPeriodDto.costCenterId,
				startDate    : createPeriodDto.startDate,
				endDate      : createPeriodDto.endDate,
				openingDate  : createPeriodDto.openingDate,
				closingDate  : createPeriodDto.closingDate,
				status       : createPeriodDto.status,
				type         : createPeriodDto.type,
			}
		} );
	}


	async findAll() {
		return this.prisma.period.findMany();
	}


	async findOne( id: string ) {
		const period = await this.prisma.period.findUnique( {
			where: { id }
		} );

		if ( !period ) {
			throw new NotFoundException( `Period with ID ${ id } not found` );
		}

		return period;
	}


	async update( id: string, updatePeriodDto: UpdatePeriodDto ) {
		const period = await this.prisma.period.findUnique( {
			where: { id }
		} );

		if ( !period ) {
			throw new NotFoundException( `Period with ID ${ id } not found` );
		}

		const merged = { ...period, ...updatePeriodDto };

		this.validatePeriodDates(
			merged.startDate,
			merged.endDate,
			merged.openingDate,
			merged.closingDate,
		);

		return this.prisma.period.update( {
			where : { id },
			data  : {
				name         : updatePeriodDto.name,
				costCenterId : updatePeriodDto.costCenterId,
				startDate    : updatePeriodDto.startDate,
				endDate      : updatePeriodDto.endDate,
				openingDate  : updatePeriodDto.openingDate,
				closingDate  : updatePeriodDto.closingDate,
				status       : updatePeriodDto.status,
				type         : updatePeriodDto.type,
			}
		} );
	}


	async remove( id: string ) {
		const period = await this.prisma.period.findUnique( {
			where: { id }
		} );

		if ( !period ) {
			throw new NotFoundException( `Period with ID ${ id } not found` );
		}

		return this.prisma.period.delete( {
			where: { id }
		} );
	}


	private validatePeriodDates( startDate: Date, endDate: Date, openingDate?: Date | null, closingDate?: Date | null ) {
		const startDay = new Date( startDate.getFullYear(), startDate.getMonth(), startDate.getDate() );
		const endDay   = new Date( endDate.getFullYear(), endDate.getMonth(), endDate.getDate() );

		if ( endDay.getTime() <= startDay.getTime() ) {
			throw new BadRequestException( 'La fecha de fin del periodo no puede ser menor o igual al mismo día que la fecha de inicio' );
		}

		if ( openingDate ) {
			if ( openingDate.getTime() < startDate.getTime() || openingDate.getTime() > endDate.getTime() ) {
				throw new BadRequestException( 'La fecha de apertura debe estar dentro del rango de la fecha de inicio y fin del periodo' );
			}
		}

		if ( closingDate ) {
			if ( closingDate.getTime() < startDate.getTime() || closingDate.getTime() > endDate.getTime() ) {
				throw new BadRequestException( 'La fecha de cierre debe estar dentro del rango del periodo' );
			}

			if ( openingDate && closingDate.getTime() <= openingDate.getTime() ) {
				throw new BadRequestException( 'La fecha de cierre debe ser posterior a la fecha de apertura' );
			}
		}
	}

}
