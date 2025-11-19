import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  IMessageBroker,
  RoutingKeys,
} from 'src/interfaces/rabbitmq/IMessageBroker';
import { NotificationsService } from 'src/notifications/notifications.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqp = require('amqplib');

@Injectable()
export default class RabbitMQProvider implements IMessageBroker {
  private exchange_name: string;
  private exchange_type: string;
  private queue_name: string;
  private readonly logger = new Logger(RabbitMQProvider.name);

  @Inject(NotificationsService)
  private readonly notificationService: NotificationsService;
  constructor() {
    this.exchange_name = 'hoshistech-exchange';
    this.exchange_type = 'topic';
    this.queue_name = RoutingKeys.NOTIFICATION_SERVICE;
  }

  /**
   * Consumes messages from a specific queue.
   *
   * If the message was processed successfully, it sends an acknowledgement to the message broker
   * so that the message is removed from the queue otherwise, the message remains in the queue.
   */
  async consume(): Promise<void> {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      const queue_name = RoutingKeys.NOTIFICATION_SERVICE;
      const exchange_name = 'hoshistech-exchange';
      const exchange_type = 'topic';

      await channel.assertQueue(queue_name);
      await channel.assertExchange(exchange_name, exchange_type, {
        durable: true,
      });

      await channel.prefetch();
      await channel.bindQueue(queue_name, exchange_name, queue_name);
      await channel.consume(queue_name, async (msg) => {
        const message = msg?.content?.toString();
        this.logger.log('message consumed from queue...');

        // acknowledge from notification service
        const isAcknowledged = await this.notificationService.process(
          JSON.parse(message),
        );

        this.logger.log('isAcknowledged');
        this.logger.log(isAcknowledged);

        if (isAcknowledged) channel.ack(msg);
      });
    } catch (error) {
      this.logger.error('failed to consume from queue...');
      this.logger.error(error);
    }
  }
}
