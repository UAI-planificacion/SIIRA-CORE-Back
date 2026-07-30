import { ISubject } from "./subject.interface";

export interface ISemesterGroup {
	semesterNumber	: number;
	subjects		: ISubject[];
}
