import {
	IsString,
	IsNotEmpty,
	IsEnum,
	IsOptional,
	IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PeriodStatus, PeriodType } from '@generated/prisma/client';

import {
	IsEndDateValid,
	IsOpeningDateValid,
	IsClosingDateValid,
} from './validators/date-validation.decorators';


export class CreatePeriodDto {

	@IsString()
	@IsNotEmpty()
	id           : string;

	@IsString()
	@IsNotEmpty()
	name         : string;

	@IsString()
	@IsNotEmpty()
	costCenterId : string;

	@Type( () => Date )
	@IsDate()
	startDate    : Date;

	@Type( () => Date )
	@IsDate()
	@IsEndDateValid( 'startDate' )
	endDate      : Date;

	@IsOptional()
	@Type( () => Date )
	@IsDate()
	@IsOpeningDateValid( 'startDate', 'endDate' )
	openingDate  ?: Date;

	@IsOptional()
	@Type( () => Date )
	@IsDate()
	@IsClosingDateValid( 'startDate', 'endDate', 'openingDate' )
	closingDate  ?: Date;

	@IsOptional()
	@IsEnum( PeriodStatus )
	status       ?: PeriodStatus;

	@IsOptional()
	@IsEnum( PeriodType )
	type         ?: PeriodType;

}
