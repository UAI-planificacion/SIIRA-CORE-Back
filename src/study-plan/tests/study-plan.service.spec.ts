import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService }     from '@prisma/prisma.service';
import { StudyPlanService }  from '@study-plan/study-plan.service';


describe( 'StudyPlanService', () => {

	let service: StudyPlanService;


	beforeEach( async () => {
		const module: TestingModule = await Test.createTestingModule( {
			providers : [
				StudyPlanService,
				{
					provide  : PrismaService,
					useValue : {},
				},
			],
		} ).compile();

		service = module.get< StudyPlanService >( StudyPlanService );
	} );


	it( 'should be defined', () => {
		expect( service ).toBeDefined();
	} );

} );

