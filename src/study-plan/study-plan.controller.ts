import {
	Controller,
	Get,
	Param,
	Query,
    ParseBoolPipe,
}                               from '@nestjs/common';
import { ApiQuery, ApiTags }    from '@nestjs/swagger';

import { StudyPlanService }             from '@study-plan/study-plan.service';
import { IStudentCurriculumResponse }   from '@study-plan/interfaces/student.interface';


@ApiTags( 'Study Plan' )
@Controller( 'study-plan' )
export class StudyPlanController {

	constructor( private readonly studyPlanService: StudyPlanService ) {}


	@Get( 'student-email/:email' )
	@ApiQuery( { name: 'activePeriod', required: false, type: Boolean } )
	getCurriculumByEmail(
		@Param( 'email' ) email: string,
		@Query( 'activePeriod', new ParseBoolPipe( { optional: true } ) ) activePeriod?: boolean
	): Promise<IStudentCurriculumResponse> {
		return this.studyPlanService.getCurriculumByEmail( email, !!activePeriod );
	}

}
