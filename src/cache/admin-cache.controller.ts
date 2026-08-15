import {
	Controller,
	Post,
	Param,
} from '@nestjs/common';
import { ApiTags }                from '@nestjs/swagger';

import { RedisCacheWarmupService } from './redis-cache-warmup.service';


@ApiTags( 'Admin Cache' )
@Controller( 'admin/periods' )
export class AdminCacheController {

	constructor( private readonly cacheWarmupService: RedisCacheWarmupService ) {}


	@Post( ':periodId/sync-cache' )
	async syncCache(
		@Param( 'periodId' ) periodId: string,
	): Promise<{ success: boolean; message: string }> {
		await this.cacheWarmupService.ping();
		await this.cacheWarmupService.syncPeriodQuotaToRedis( periodId );

		return {
			success : true,
			message : `Successfully synchronized cache for period ${ periodId }`,
		};
	}

}
