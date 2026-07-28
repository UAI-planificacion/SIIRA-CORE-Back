import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';


export function IsPlanningEndDateValid( property: string, validationOptions?: ValidationOptions ) {
	return function ( object: Object, propertyName: string ) {
		registerDecorator( {
			name         : 'isPlanningEndDateValid',
			target       : object.constructor,
			propertyName : propertyName,
			constraints  : [ property ],
			options      : validationOptions,
			validator    : {
				validate( value: any, args: ValidationArguments ) {
					const [ startDateName ] = args.constraints;
					const startDate = ( args.object as any )[ startDateName ];

					if ( !( value instanceof Date ) || !( startDate instanceof Date ) ) {
						return false;
					}

					const startDay = new Date( startDate.getFullYear(), startDate.getMonth(), startDate.getDate() );
					const endDay   = new Date( value.getFullYear(), value.getMonth(), value.getDate() );

					return endDay.getTime() > startDay.getTime();
				},
				defaultMessage( _: ValidationArguments ) {
					return 'La fecha de fin de planificación no puede ser menor o igual al mismo día que la fecha de inicio';
				}
			}
		} );
	};
}


export function IsEnrollmentStartDateValid( property: string, validationOptions?: ValidationOptions ) {
	return function ( object: Object, propertyName: string ) {
		registerDecorator( {
			name         : 'isEnrollmentStartDateValid',
			target       : object.constructor,
			propertyName : propertyName,
			constraints  : [ property ],
			options      : validationOptions,
			validator    : {
				validate( value: any, args: ValidationArguments ) {
					const [ planningEndDateName ] = args.constraints;
					const planningEndDate = ( args.object as any )[ planningEndDateName ];

					if ( !( value instanceof Date ) || !( planningEndDate instanceof Date ) ) {
						return false;
					}

					const planEndDay   = new Date( planningEndDate.getFullYear(), planningEndDate.getMonth(), planningEndDate.getDate() );
					const enrollStartDay = new Date( value.getFullYear(), value.getMonth(), value.getDate() );

					return enrollStartDay.getTime() > planEndDay.getTime();
				},
				defaultMessage( _: ValidationArguments ) {
					return 'La etapa de inscripción (enrollment) debe comenzar al menos el día siguiente del fin de planificación';
				}
			}
		} );
	};
}


export function IsEnrollmentEndDateValid( property: string, validationOptions?: ValidationOptions ) {
	return function ( object: Object, propertyName: string ) {
		registerDecorator( {
			name         : 'isEnrollmentEndDateValid',
			target       : object.constructor,
			propertyName : propertyName,
			constraints  : [ property ],
			options      : validationOptions,
			validator    : {
				validate( value: any, args: ValidationArguments ) {
					const [ startDateName ] = args.constraints;
					const startDate = ( args.object as any )[ startDateName ];

					if ( !( value instanceof Date ) || !( startDate instanceof Date ) ) {
						return false;
					}

					const startDay = new Date( startDate.getFullYear(), startDate.getMonth(), startDate.getDate() );
					const endDay   = new Date( value.getFullYear(), value.getMonth(), value.getDate() );

					return endDay.getTime() > startDay.getTime();
				},
				defaultMessage( _: ValidationArguments ) {
					return 'La fecha de fin de inscripción (enrollment) no puede ser menor o igual al mismo día que su fecha de inicio';
				}
			}
		} );
	};
}
