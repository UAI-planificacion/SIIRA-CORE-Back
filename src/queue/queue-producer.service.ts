import { Injectable }  from '@nestjs/common';
import { Queue }       from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';


@Injectable()
export class QueueProducerService {

	constructor(
		@InjectQueue( 'siira-enrollment-queue' ) private readonly queue: Queue,
	) {}


	async enqueueEnrollment(
		email     : string,
		periodId  : string,
		ticketId  : string,
		sessionId : string,
	): Promise<void> {
		await this.queue.add(
			'ENROLL_SECTIONS',
			{
				email,
				periodId,
				ticketId,
				sessionIds : [ sessionId ],
			},
			{
				jobId    : `enroll-${ email }-${ sessionId }-${ ticketId }`,
				attempts : 3,
				backoff  : {
					type  : 'exponential',
					delay : 1000,
				},
			},
		);
	}


	async enqueueUnenrollment(
		email     : string,
		periodId  : string,
		ticketId  : string,
		sessionId : string,
	): Promise<void> {
		await this.queue.add(
			'UNENROLL_SECTIONS',
			{
				email,
				periodId,
				ticketId,
				sessionIds : [ sessionId ],
			},
			{
				jobId    : `unenroll-${ email }-${ sessionId }-${ ticketId }`,
				attempts : 3,
				backoff  : {
					type  : 'exponential',
					delay : 1000,
				},
			},
		);
	}

}

