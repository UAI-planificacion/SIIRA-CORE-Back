import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService }       from '@prisma/prisma.service';
import { StudyPlanController } from '@study-plan/study-plan.controller';
import { StudyPlanService }    from '@study-plan/study-plan.service';


describe( 'StudyPlanController', () => {

	let controller: StudyPlanController;


	beforeEach( async () => {
		const module: TestingModule = await Test.createTestingModule( {
			controllers : [ StudyPlanController ],
			providers   : [
				StudyPlanService,
				{
					provide  : PrismaService,
					useValue : {},
				},
			],
		} ).compile();

		controller = module.get< StudyPlanController >( StudyPlanController );
	} );


	it( 'should be defined', () => {
		expect( controller ).toBeDefined();
	} );

} );

