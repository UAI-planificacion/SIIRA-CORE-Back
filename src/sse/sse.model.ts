export enum EnumAction {
	CREATE      = 'create',
	UPDATE      = 'update',
	DELETE      = 'delete',
    ENROLL      = 'enroll',
    UNENROLL    = 'unenroll',
}


export enum Entity {
    ENROLLMENT  = 'enrollment',
	TEST        = 'test',
	QUOTE       = 'quote',
}


export interface EmitEvent {
	message : any;
	action  : EnumAction;
	entity  : Entity;
	origin? : string | undefined;
}
