import {
	Controller,
	Get,
	Post,
	Param,
	Query,
    Headers,
	Body,
	HttpCode,
	HttpStatus,
	ParseBoolPipe,
    UnauthorizedException,
}                               from '@nestjs/common';
import { ApiQuery, ApiTags }    from '@nestjs/swagger';

import { StudyPlanService }             from '@study-plan/study-plan.service';
import { IStudentCurriculumResponse }   from '@study-plan/interfaces/student.interface';
import { NotifyEnrollmentDto }          from './dto/notify-enrollment.dto';
import { ENVS }                         from '@app/config/envs';


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
        @Headers('X-Notification-Secret') secret: string,
		@Body() notifyDto: NotifyEnrollmentDto,
	): Promise<{ success: boolean }> {
        if ( secret !== ENVS.NOTIFICATION.SECRET_KEY ) {
            throw new UnauthorizedException( 'Invalid notification secret key' );
        }

		return this.studyPlanService.handleEnrollmentNotification( notifyDto );
	}

}
