import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';


export function IsEndDateValid( property: string, validationOptions?: ValidationOptions ) {
	return function ( object: Object, propertyName: string ) {
		registerDecorator( {
			name         : 'isEndDateValid',
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
					return 'La fecha de fin del periodo no puede ser menor o igual al mismo día que la fecha de inicio';
				}
			}
		});
	};
}


export function IsOpeningDateValid(
    startDateProperty   : string,
    endDateProperty     : string,
    validationOptions?  : ValidationOptions
) {
	return function ( object: Object, propertyName: string ) {
		registerDecorator( {
			name         : 'isOpeningDateValid',
			target       : object.constructor,
			propertyName : propertyName,
			constraints  : [ startDateProperty, endDateProperty ],
			options      : validationOptions,
			validator    : {
				validate( value: any, args: ValidationArguments ) {
					if ( !value ) return true;

					const [ startDateName, endDateName ]    = args.constraints;
					const startDate                         = ( args.object as any )[ startDateName ];
					const endDate                           = ( args.object as any )[ endDateName ];

					if ( !( value instanceof Date ) ) return false;

					if ( startDate instanceof Date && value.getTime() < startDate.getTime() ) {
						return false;
					}

					if ( endDate instanceof Date && value.getTime() > endDate.getTime() ) {
						return false;
					}

					return true;
				},
				defaultMessage( _: ValidationArguments ) {
					return 'La fecha de apertura debe estar dentro del rango de la fecha de inicio y fin del periodo';
				}
			}
		} );
	};
}


export function IsClosingDateValid(
    startDateProperty   : string,
    endDateProperty     : string,
    openingDateProperty : string,
    validationOptions?  : ValidationOptions
) {
	return function ( object: Object, propertyName: string ) {
		registerDecorator({
			name         : 'isClosingDateValid',
			target       : object.constructor,
			propertyName : propertyName,
			constraints  : [ startDateProperty, endDateProperty, openingDateProperty ],
			options      : validationOptions,
			validator    : {
				validate( value: any, args: ValidationArguments ) {
					if ( !value ) return true;

					const [
                        startDateName,
                        endDateName,
                        openingDateName
                    ]                   = args.constraints;
					const startDate     = ( args.object as any )[ startDateName ];
					const endDate       = ( args.object as any )[ endDateName ];
					const openingDate   = ( args.object as any )[ openingDateName ];

					if ( !( value instanceof Date ) ) return false;

					if ( startDate instanceof Date && value.getTime() < startDate.getTime() ) {
						return false;
					}

					if ( endDate instanceof Date && value.getTime() > endDate.getTime() ) {
						return false;
					}

					if ( openingDate instanceof Date && value.getTime() <= openingDate.getTime() ) {
						return false;
					}

					return true;
				},
				defaultMessage( _: ValidationArguments ) {
					return 'La fecha de cierre debe estar dentro del rango del periodo y ser posterior a la fecha de apertura';
				}
			}
		});
	};
}
