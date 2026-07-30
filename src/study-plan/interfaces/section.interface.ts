import { ISession } from "./session.interface";

export interface ISection {
	id			: string;
	code		: number;
	isClosed	: boolean;
	groupId		: string;
	startDate	: Date;
	endDate		: Date;
	spaceType	: string | null;
	registered	: number | null;
	building	: string | null;
	quota		: number;
	periodId	: string;
	sessions	: ISession[];
}