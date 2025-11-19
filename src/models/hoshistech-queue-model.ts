import { QUEUE_EVENT } from '../enums/queue/queue_event.enum';

export class HoshistechQueueModel<T> {
  pattern: QUEUE_EVENT;
  data: T;

  constructor(event: QUEUE_EVENT, data: T) {
    this.pattern = event;
    this.data = data;
  }
}
