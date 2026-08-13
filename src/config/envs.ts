import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars {
	PORT            : number;
	DATABASE_URL    : string;
	ALLOWED_ORIGINS : string;
	REDIS_HOST      : string;
	REDIS_PORT      : number;
	REDIS_PASSWORD  : string;
	REDIS_TLS       : boolean;

    NOTIFICATION_SECRET_KEY: string;
}


const envsSchema = joi.object({
	PORT            : joi.number().required(),
	DATABASE_URL    : joi.string().required(),
	ALLOWED_ORIGINS : joi.string().required(),
	REDIS_HOST      : joi.string().required(),
	REDIS_PORT      : joi.number().default( 6379 ),
	REDIS_PASSWORD  : joi.string().allow( '' ).default( '' ),
	REDIS_TLS       : joi.boolean().default( false ),

    NOTIFICATION_SECRET_KEY: joi.string().required(),
})
.unknown( true );


const { error, value } = envsSchema.validate( process.env );


if ( error ) throw new Error( `Config validation error: ${ error.message }` );


const envVars: EnvVars = value;


export const ENVS = {
	PORT            : envVars.PORT,
	DATABASE_URL    : envVars.DATABASE_URL,
	ALLOWED_ORIGINS : envVars.ALLOWED_ORIGINS.split( ',' ),

    REDIS : {
        HOST      : envVars.REDIS_HOST,
        PORT      : envVars.REDIS_PORT,
        PASSWORD  : envVars.REDIS_PASSWORD,
        TLS       : envVars.REDIS_TLS,
    },

    NOTIFICATION : {
        SECRET_KEY: envVars.NOTIFICATION_SECRET_KEY,
    },
}
