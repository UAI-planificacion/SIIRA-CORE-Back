import {
	Injectable,
	Logger,
	OnModuleDestroy,
	ServiceUnavailableException,
} from '@nestjs/common';
import Redis                     from 'ioredis';

import { ENVS }                  from '@config/envs';
import { PrismaService }         from '@prisma/prisma.service';


export interface SessionQuota {
	capacity        : number;
	registered      : number;
	chairsAvailable : number;
}


@Injectable()
export class RedisCacheWarmupService implements OnModuleDestroy {

	private readonly redisClient : Redis;
	private readonly logger      : Logger = new Logger( RedisCacheWarmupService.name );


	constructor( private readonly prisma: PrismaService ) {
		this.redisClient = new Redis({
			host     : ENVS.REDIS.HOST,
			port     : ENVS.REDIS.PORT,
			password : ENVS.REDIS.PASSWORD,
			tls      : ENVS.REDIS.TLS ? {} : undefined,
		});
	}


	async onModuleDestroy(): Promise<void> {
		await this.redisClient.quit();
	}


	async ping(): Promise<void> {
		try {
			await this.redisClient.ping();
		} catch ( error ) {
			this.logger.error( 'Redis connection test failed via ping():', error );
			throw new ServiceUnavailableException( 'No se puede procesar la configuración: El servicio de Redis no está disponible.' );
		}
	}


	private buildQuotaKey( sessionId: string ): string {
		return `session:quota:${ sessionId }`;
	}


	async syncPeriodQuotaToRedis( periodId: string ): Promise<void> {
		try {
			const sessions = await this.prisma.session.findMany({
				where : {
					section : {
						periodId : periodId,
					},
				},
				select : {
					id              : true,
					quota           : true,
					chairsAvailable : true,
				},
			});

			if ( sessions.length === 0 ) {
				this.logger.warn( `No sessions found to sync for period ID: ${ periodId }` );
				return;
			}

			const pipeline = this.redisClient.pipeline();

			for ( const session of sessions ) {
				const capacity        = session.quota;
				const chairsAvailable = session.chairsAvailable ?? session.quota;
				const registered      = capacity - chairsAvailable;

				const quotaData: SessionQuota = {
					capacity        : capacity,
					registered      : registered,
					chairsAvailable : chairsAvailable,
				};

				pipeline.set( this.buildQuotaKey( session.id ), JSON.stringify( quotaData ) );
			}

			await pipeline.exec();
			this.logger.log( `Successfully synchronized ${ sessions.length } sessions for period ID: ${ periodId }` );
		} catch ( error ) {
			this.logger.error( `Failed to sync period quota to Redis for period ID ${ periodId }:`, error );
			throw error;
		}
	}


	async deleteSessionQuotaFromRedis( sessionId: string ): Promise<void> {
		try {
			const key = this.buildQuotaKey( sessionId );
			await this.redisClient.del( key );
			this.logger.log( `Successfully deleted session quota key from Redis: ${ key }` );
		} catch ( error ) {
			this.logger.error( `Failed to delete session quota from Redis for session ID ${ sessionId }:`, error );
			throw error;
		}
	}


	async deletePeriodQuotasFromRedis( periodId: string ): Promise<void> {
		try {
			const sessions = await this.prisma.session.findMany({
				where : {
					section : {
						periodId : periodId,
					},
				},
				select : {
					id : true,
				},
			});

			if ( sessions.length === 0 ) {
				return;
			}

			const keys     = sessions.map( ( session ) => this.buildQuotaKey( session.id ) );
			const pipeline = this.redisClient.pipeline();

			for ( const key of keys ) {
				pipeline.del( key );
			}

			await pipeline.exec();
			this.logger.log( `Successfully deleted ${ keys.length } session quota keys from Redis for period ID: ${ periodId }` );
		} catch ( error ) {
			this.logger.error( `Failed to delete period quotas from Redis for period ID ${ periodId }:`, error );
			throw error;
		}
	}

}
