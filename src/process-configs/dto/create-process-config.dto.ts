import { ApiProperty } from '@nestjs/swagger';

import {
	IsString,
	IsNotEmpty,
	IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
	IsPlanningEndDateValid,
	IsEnrollmentStartDateValid,
	IsEnrollmentEndDateValid,
} from './validators/process-config-date.decorators';


export class CreateProcessConfigDto {

    @ApiProperty({ 
        description : 'Identificador único del periodo asociado al proceso de admisión',
        example     : '2024',
        minLength   : 1,
        maxLength   : 20,
    })
	@IsString()
	@IsNotEmpty()
	periodId            : string;

    @ApiProperty({ 
        description : 'Fecha de inicio de la planificación',
        example     : '2024-01-01',
        format      : 'date',
    })
	@Type( () => Date )
	@IsDate()
	planningStartDate   : Date;

    @ApiProperty({ 
        description : 'Fecha de fin de la planificación',
        example     : '2024-01-01',
        format      : 'date',
    })
	@Type( () => Date )
	@IsDate()
	@IsPlanningEndDateValid( 'planningStartDate' )
	planningEndDate     : Date;

    @ApiProperty({ 
        description : 'Fecha de inicio de la inscripción',
        example     : '2024-01-01',
        format      : 'date',
    })
	@Type( () => Date )
	@IsDate()
	@IsEnrollmentStartDateValid( 'planningEndDate' )
	enrollmentStartDate : Date;

    @ApiProperty({ 
        description : 'Fecha de fin de la inscripción',
        example     : '2024-01-01',
        format      : 'date',
    })
	@Type( () => Date )
	@IsDate()
	@IsEnrollmentEndDateValid( 'enrollmentStartDate' )
	enrollmentEndDate   : Date;

}
