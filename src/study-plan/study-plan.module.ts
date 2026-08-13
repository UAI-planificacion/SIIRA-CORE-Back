import { Module }              from '@nestjs/common';
import { StudyPlanService }    from './study-plan.service';
import { StudyPlanController } from './study-plan.controller';
import { QueueModule }         from '@queue/queue.module';
import { SseModule }           from '@sse/sse.module';


@Module( {
	imports     : [ QueueModule, SseModule ],
	controllers : [ StudyPlanController ],
	providers   : [ StudyPlanService ],
} )
export class StudyPlanModule {}

