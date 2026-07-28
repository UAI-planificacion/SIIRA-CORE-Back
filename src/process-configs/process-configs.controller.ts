import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
}                           from '@nestjs/common';
import { ApiTags }          from '@nestjs/swagger';
import { ProcessConfig }    from '@generated/prisma/client';

import { ProcessConfigsService }    from './process-configs.service';
import { CreateProcessConfigDto }   from './dto/create-process-config.dto';
import { UpdateProcessConfigDto }   from './dto/update-process-config.dto';


@ApiTags( 'Process Configs' )
@Controller( 'process-configs' )
export class ProcessConfigsController {

	constructor( private readonly processConfigsService: ProcessConfigsService ) {}


	@Post()
	create(
        @Body() createProcessConfigDto: CreateProcessConfigDto
    ): Promise<ProcessConfig> {
		return this.processConfigsService.create( createProcessConfigDto );
	}


	@Get()
	findAll() {
		return this.processConfigsService.findAll();
	}


	@Get( ':id' )
	findOne(
        @Param( 'id' ) id: string
    ): Promise<ProcessConfig> {
		return this.processConfigsService.findOne( id );
	}


	@Patch( ':id' )
	update(
        @Param( 'id' ) id: string,
        @Body() updateProcessConfigDto: UpdateProcessConfigDto
    ): Promise<ProcessConfig> {
		return this.processConfigsService.update( id, updateProcessConfigDto );
	}


	@Delete( ':id' )
	remove(
        @Param( 'id' ) id: string
    ): Promise<ProcessConfig> {
		return this.processConfigsService.remove( id );
	}

}
