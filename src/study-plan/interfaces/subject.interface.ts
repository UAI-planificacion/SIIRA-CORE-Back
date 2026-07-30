import { SubjectStatus } from '@generated/prisma/client';
import { ISection }      from './section.interface';


export interface IAcademicHistory {
	status		: SubjectStatus;
	finalGrade	: number | null;
}


export interface ISubject {
	id				: string;
	name			: string;
	isActive		: boolean;
	spaceType		: string | null;
	credits			: number;
	description		: string | null;
	isRequired		: boolean;
    prerequisites   : string[];
	sections		: ISection[];
	academicHistory	: IAcademicHistory | null;
}
