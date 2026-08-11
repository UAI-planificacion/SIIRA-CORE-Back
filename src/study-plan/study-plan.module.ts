import { Module }              from '@nestjs/common';
import { StudyPlanService }    from './study-plan.service';
import { StudyPlanController } from './study-plan.controller';
import { QueueModule }         from '@queue/queue.module';


@Module( {
	imports     : [ QueueModule ],
	controllers : [ StudyPlanController ],
	providers   : [ StudyPlanService ],
} )
export class StudyPlanModule {}

