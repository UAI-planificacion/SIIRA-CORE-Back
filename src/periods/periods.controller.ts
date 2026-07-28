import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';

import { Period }           from '@generated/prisma/client';
import { PeriodsService }   from './periods.service';
import { CreatePeriodDto }  from './dto/create-period.dto';
import { UpdatePeriodDto }  from './dto/update-period.dto';


@Controller( 'periods' )
export class PeriodsController {

	constructor( private readonly periodsService: PeriodsService ) {}


	@Post()
	create( @Body() createPeriodDto: CreatePeriodDto ): Promise<Period> {
		return this.periodsService.create( createPeriodDto );
	}


	@Get()
	findAll(): Promise<Period[]> {
		return this.periodsService.findAll();
	}


	@Get( ':id' )
	findOne( @Param( 'id' ) id: string ): Promise<Period> {
		return this.periodsService.findOne( id );
	}


	@Patch( ':id' )
	update( @Param( 'id' ) id: string, @Body() updatePeriodDto: UpdatePeriodDto ): Promise<Period> {
		return this.periodsService.update( id, updatePeriodDto );
	}


	@Delete( ':id' )
	remove( @Param( 'id' ) id: string ): Promise<Period> {
		return this.periodsService.remove( id );
	}

}
