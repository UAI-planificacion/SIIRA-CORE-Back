import { PartialType } from '@nestjs/swagger';
import { CreateProcessConfigDto } from './create-process-config.dto';


export class UpdateProcessConfigDto extends PartialType( CreateProcessConfigDto ) {}
