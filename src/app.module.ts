import { Module } from '@nestjs/common';

import { AppController }        from './app.controller';
import { PrismaModule }         from './prisma/prisma.module';
import { SeedModule }           from './seed/seed.module';
import { PeriodsModule }        from './periods/periods.module';
import { ProcessConfigsModule } from './process-configs/process-configs.module';
import { StudyPlanModule }      from './study-plan/study-plan.module';


@Module({
    imports         : [
        PrismaModule,
        SeedModule,
        PeriodsModule,
        ProcessConfigsModule,
        StudyPlanModule
    ],
    controllers     : [AppController],
    providers       : [],
})
export class AppModule { }
