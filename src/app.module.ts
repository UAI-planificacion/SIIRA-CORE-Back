import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';

import { AppController }    from './app.controller';
import { PrismaModule }     from './prisma/prisma.module';


@Module({
    imports         : [PrismaModule, SeedModule],
    controllers     : [AppController],
    providers       : [],
})
export class AppModule { }
