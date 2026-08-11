import { Injectable }  from '@nestjs/common';
import { Queue }       from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';


@Injectable()
export class QueueProducerService {

	constructor(
		@InjectQueue( 'siira-enrollment-queue' ) private readonly queue: Queue,
	) {}


	async enqueueEnrollment(
		studentId : string,
		periodId  : string,
		ticketId  : string,
		sessionId : string,
	): Promise<void> {
		await this.queue.add(
			'ENROLL_SECTIONS',
			{
				studentId,
				periodId,
				ticketId,
				sessionIds : [ sessionId ],
			},
			{
				jobId    : `enroll-${ studentId }-${ sessionId }-${ ticketId }`,
				attempts : 3,
				backoff  : {
					type  : 'exponential',
					delay : 1000,
				},
			},
		);
	}


	async enqueueUnenrollment(
		studentId : string,
		periodId  : string,
		ticketId  : string,
		sessionId : string,
	): Promise<void> {
		await this.queue.add(
			'UNENROLL_SECTIONS',
			{
				studentId,
				periodId,
				ticketId,
				sessionIds : [ sessionId ],
			},
			{
				jobId    : `unenroll-${ studentId }-${ sessionId }-${ ticketId }`,
				attempts : 3,
				backoff  : {
					type  : 'exponential',
					delay : 1000,
				},
			},
		);
	}

}

