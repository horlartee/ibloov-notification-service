import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CoreController } from 'src/core/core.controller';
import { CoreModule } from 'src/core/core.module';
import { CoreService } from 'src/core/core.service';
import { EmailCoreService } from 'src/core/emails.core.service';
import { PushCoreService } from 'src/core/pushNotification.core.service';
import { SmsCoreService } from 'src/core/sms.core.service';
import { WhatsappCoreService } from 'src/core/whatsapp.core.service';
import { AppContainer } from 'src/enums/app.container.enum';
import { IbloovATSms } from 'src/providers/africastalking.sms.provider';
import OneSignalProvider from 'src/providers/onesignal.provider';
import { IbloovPostmark } from 'src/providers/postmark.provider';
import { IbloovSendGrid } from 'src/providers/sendgrid.mail';
import RabbitMQProvider from 'src/rabbitmqProvider/rabbitmq.provider';
import { NotificationController } from './notification.controller';
import { NotificationsService } from './notifications.service';
import TwilioProvider from 'src/providers/twilio.provider';

@Module({
  imports: [LoggerModule.forRoot(), CoreModule],

  controllers: [NotificationController],
  providers: [
    NotificationsService,
    CoreController,
    EmailCoreService,
    PushCoreService,
    SmsCoreService,
    CoreService,
    WhatsappCoreService,

    {
      provide: 'RABBIT_MQ',
      useClass: RabbitMQProvider,
    },
    {
      provide: AppContainer.EMAIL_PROVIDER,
      useClass: IbloovPostmark,
    },
    {
      provide: AppContainer.PUSH_NOTIFICATION,
      useClass: OneSignalProvider,
    },
    {
      provide: AppContainer.MAIL_LIST_PROVIDER,
      useClass: IbloovSendGrid,
    },
    {
      provide: AppContainer.SMS_PROVIDER,
      useClass: IbloovATSms,
    },

    {
      provide: AppContainer.WHATSAPP_PROVIDER,
      useClass: TwilioProvider,
    },
  ],
})
export class NotificationModule {}
