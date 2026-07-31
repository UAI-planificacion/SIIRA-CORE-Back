import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService }                from '@prisma/prisma.service';
import { IStudentCurriculumResponse }   from '@study-plan/interfaces/student.interface';
import { ISubject }                     from '@study-plan/interfaces/subject.interface';
import { ISemesterGroup }               from '@study-plan/interfaces/semester-group.interface';


@Injectable()
export class StudyPlanService {

	constructor( private readonly prisma: PrismaService ) {}


	async getCurriculumByEmail(
        email           : string,
        activePeriod    : boolean
    ): Promise<IStudentCurriculumResponse> {
		const now       = new Date();
		const student   = await this.prisma.student.findUnique({
			where	: { email },
			include	: {
				subjectHistories : true,
				career : {
					include : {
						planSubjects : {
							include : {
								subject : {
									include : {
										sections : {
											where	: activePeriod
												? {
													period : {
														startDate	: { lte: now },
														endDate		: { gte: now },
													},
												}
												: undefined,
											include	: {
												sessions : {
													include : {
														module		: true,
														professor	: {
															select : {
																id		: true,
																name	: true,
																email	: true,
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});

		if ( !student ) {
			throw new NotFoundException( `No se encontró un estudiante con el correo ${ email }` );
		}

		const getSubjectHistory = ( subjectId: string ) => {
			const records = student.subjectHistories.filter( ( h ) => h.subjectId === subjectId );

            if ( records.length === 0 ) {
				return null;
			}

			const completed = records.find( ( r ) => r.status === 'APPROVED' || r.status === 'CREDITED' );

            if ( completed ) {
				return {
					status		: completed.status,
					finalGrade	: completed.finalGrade,
				};
			}

			const inProgress = records.find( ( r ) => r.status === 'IN_PROGRESS' );

            if ( inProgress ) {
				return {
					status		: inProgress.status,
					finalGrade	: inProgress.finalGrade,
				};
			}

			const sorted = [ ...records ].sort( ( a, b ) => b.updatedAt.getTime() - a.updatedAt.getTime() );

            return {
				status		: sorted[ 0 ].status,
				finalGrade	: sorted[ 0 ].finalGrade,
			};
		};

		const semestersMap = new Map< number, ISubject[] >();

		for ( const planSubject of student.career.planSubjects ) {
			const subjectData = planSubject.subject;
			const semesterNum = planSubject.semesterNumber;

			const mappedSubject: ISubject = {
				id				: subjectData.id,
				name			: subjectData.name,
				isActive		: subjectData.isActive,
				spaceType		: subjectData.spaceType,
				credits			: subjectData.credits,
				description		: subjectData.description,
				isRequired		: planSubject.isRequired,
                prerequisites   : planSubject.prerequisites || [],
				academicHistory	: getSubjectHistory( subjectData.id ),
				sections		: subjectData.sections.map( ( section ) => ( {
					id		        : section.id,
					code	        : section.code,
					isClosed        : section.isClosed,
					groupId	        : section.groupId,
					startDate	    : section.startDate,
					endDate	        : section.endDate,
					spaceType       : section.spaceType,
					registered      : section.registered,
					building        : section.building,
					quota	        : section.quota,
					periodId        : section.periodId,
					sessions        : section.sessions.map( ( session ) => ( {
                        id				: session.id,
						name			: session.name,
						chairsAvailable	: session.chairsAvailable,
						isEnglish		: session.isEnglish,
						date			: session.date,
						quota			: session.quota,
                        spaceId         : session.spaceId,
						professor		: session.professor
							? {
								id		: session.professor.id,
								name	: session.professor.name,
								email	: session.professor.email,
							}
							: null,
						module			: {
							id			: session.module.id,
							code		: session.module.code,
							startHour	: session.module.startHour,
							endHour		: session.module.endHour,
						},
					})),
				})),
			};

			if ( !semestersMap.has( semesterNum )) {
				semestersMap.set( semesterNum, [] );
			}

            semestersMap.get( semesterNum )!.push( mappedSubject );
		}

		const semesters: ISemesterGroup[] = Array.from( semestersMap.entries() )
			.map(([ semesterNumber, subjects ]) => ({
				semesterNumber,
				subjects,
			}))
			.sort(( a, b ) => a.semesterNumber - b.semesterNumber );

		return {
			studentId	: student.id,
			studentName	: student.fullName,
			email		: student.email,
			careerId	: student.careerId,
			careerName	: student.career.name,
			semesters,
		};
	}

}
