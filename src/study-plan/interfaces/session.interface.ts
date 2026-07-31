import { IModule } from "./module.interface";
import { IProfessor } from "./professor.interface";

export interface ISession {
	id				: string;
	name			: string;
	chairsAvailable	: number | null;
	isEnglish		: boolean;
	date			: Date;
	professor		: IProfessor | null;
	module			: IModule;
    quota           : number;
    spaceId         : string | null;
}
