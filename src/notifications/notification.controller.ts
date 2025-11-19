import { Controller, Inject } from '@nestjs/common';
import RabbitMQProvider from 'src/rabbitmqProvider/rabbitmq.provider';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject('RABBIT_MQ')
    private readonly messageBroker: RabbitMQProvider,
  ) {
    this.dequeue();
  }

  async dequeue() {
    this.messageBroker.consume();
  }
}
