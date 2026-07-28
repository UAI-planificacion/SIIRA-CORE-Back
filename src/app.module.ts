import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { PeriodsModule } from './periods/periods.module';
import { ProcessConfigsModule } from './process-configs/process-configs.module';

import { AppController }    from './app.controller';
import { PrismaModule }     from './prisma/prisma.module';


@Module({
    imports         : [PrismaModule, SeedModule, PeriodsModule, ProcessConfigsModule],
    controllers     : [AppController],
    providers       : [],
})
export class AppModule { }
