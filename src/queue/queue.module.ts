import { Module }     from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { QueueProducerService } from './queue-producer.service';
import { ENVS }                 from '@config/envs';


@Module( {
	imports   : [
		BullModule.forRoot( {
			connection : {
				host     : ENVS.REDIS.HOST,
				port     : ENVS.REDIS.PORT,
				password : ENVS.REDIS.PASSWORD,
				tls      : ENVS.REDIS.TLS ? {} : undefined,
			},
		} ),
		BullModule.registerQueue( {
			name : 'siira-enrollment-queue',
		} ),
	],
	providers : [ QueueProducerService ],
	exports   : [ QueueProducerService ],
} )
export class QueueModule {}
