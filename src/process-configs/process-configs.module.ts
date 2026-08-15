import { Module }                 from '@nestjs/common';
import { ProcessConfigsService }  from './process-configs.service';
import { ProcessConfigsController } from './process-configs.controller';
import { CacheModule }            from '../cache/cache.module';


@Module({
	imports     : [ CacheModule ],
	controllers : [ ProcessConfigsController ],
	providers   : [ ProcessConfigsService ],
})
export class ProcessConfigsModule {}
