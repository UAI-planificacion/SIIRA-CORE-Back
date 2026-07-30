import { ISemesterGroup } from "./semester-group.interface";

export interface IStudentCurriculumResponse {
    studentId	: string;
    studentName	: string;
    email		: string;
    careerId	: string;
    careerName	: string;
    semesters	: ISemesterGroup[];
}