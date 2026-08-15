import { Module }                  from '@nestjs/common';

import { RedisCacheWarmupService } from './redis-cache-warmup.service';
import { AdminCacheController }    from './admin-cache.controller';


@Module({
	controllers : [ AdminCacheController ],
	providers   : [ RedisCacheWarmupService ],
	exports     : [ RedisCacheWarmupService ],
})
export class CacheModule {}
