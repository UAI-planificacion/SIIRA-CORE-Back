import { IsString, IsArray, IsEnum } from 'class-validator';


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

	@IsArray()
	@IsString( { each: true } )
	sessionIds : string[];

	@IsEnum( EnrollmentActionType )
	actionType : EnrollmentActionType;

	@IsEnum( EnrollmentNotifyStatus )
	status     : EnrollmentNotifyStatus;

}
