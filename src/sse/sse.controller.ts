import {
	Controller,
	Header,
	MessageEvent,
	Post,
	Sse,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map }        from 'rxjs/operators';

import { SseService }         from '@sse/sse.service';
import { EnumAction, Entity } from '@sse/sse.model';


@Controller( 'sse' )
export class SseController {

	constructor(
		private readonly sseService: SseService
	) {}


    @Sse()
	@Header( 'X-Accel-Buffering', 'no' )
	subscribe(): Observable<MessageEvent> {
		return this.sseService.getEvents().pipe(
			map( ( event ) => ( {
				data: event,
			} as MessageEvent ) )
		);
	}


    emitEvent( data: any ): void {
		this.sseService.emitEvent( data );
	}


    @Post( 'emit' )
	emitExampleEvent(): void {
		this.sseService.emitEvent( {
			message : 'Este es un evento SSE',
			action  : EnumAction.CREATE,
			entity  : Entity.TEST,
		});
	}

}
