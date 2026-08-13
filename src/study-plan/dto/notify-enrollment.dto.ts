import { IsString, IsEnum, IsOptional } from 'class-validator';


export enum EnrollmentActionType {
	ENROLL   = 'ENROLL',
	UNENROLL = 'UNENROLL',
}


export enum EnrollmentNotifyStatus {
	SUCCESS = 'SUCCESS',
	FAILED  = 'FAILED',
	PARTIAL = 'PARTIAL',
}


export class NotifyEnrollmentDto {

	@IsString()
	ticketId   : string;

	@IsString()
	studentId  : string;

	@IsString()
	sessionId  : string;

	@IsEnum( EnrollmentActionType )
	actionType : EnrollmentActionType;

	@IsEnum( EnrollmentNotifyStatus )
	status     : EnrollmentNotifyStatus;

	@IsString()
	ssec: string;

}
