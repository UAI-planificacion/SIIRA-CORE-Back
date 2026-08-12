import {
	Controller,
	Get,
	Post,
	Param,
	Query,
	Body,
	HttpCode,
	HttpStatus,
	ParseBoolPipe,
}                               from '@nestjs/common';
import { ApiQuery, ApiTags }    from '@nestjs/swagger';

import { StudyPlanService }             from '@study-plan/study-plan.service';
import { IStudentCurriculumResponse }   from '@study-plan/interfaces/student.interface';
import { NotifyEnrollmentDto }          from './dto/notify-enrollment.dto';


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


	@Post( 'subscribe/:sessionId/:email' )
	@HttpCode( HttpStatus.ACCEPTED )
	subscribe(
		@Param( 'sessionId' ) sessionId: string,
		@Param( 'email' ) email: string,
	): Promise<{ ticketId: string }> {
		return this.studyPlanService.subscribeStudent( email, sessionId );
	}


	@Post( 'unsubscribe/:sessionId/:email' )
	@HttpCode( HttpStatus.ACCEPTED )
	unsubscribe(
		@Param( 'sessionId' ) sessionId: string,
		@Param( 'email' ) email: string,
	): Promise<{ ticketId: string }> {
		return this.studyPlanService.unsubscribeStudent( email, sessionId );
	}


	@Post( 'notify-enrollment' )
	@HttpCode( HttpStatus.OK )
	notifyEnrollment(
		@Body() notifyDto: NotifyEnrollmentDto,
	): Promise<{ success: boolean }> {
		return this.studyPlanService.handleEnrollmentNotification( notifyDto );
	}


}
