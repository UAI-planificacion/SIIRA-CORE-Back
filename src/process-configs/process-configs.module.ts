import { Module } from '@nestjs/common';
import { ProcessConfigsService } from './process-configs.service';
import { ProcessConfigsController } from './process-configs.controller';

@Module({
	controllers : [ ProcessConfigsController ],
	providers   : [ ProcessConfigsService ],
})
export class ProcessConfigsModule {}
