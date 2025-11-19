import { Module } from '@nestjs/common';
import { IbloovATSms } from 'src/providers/africastalking.sms.provider';
import OneSignalProvider from 'src/providers/onesignal.provider';
import { IbloovPostmark } from 'src/providers/postmark.provider';
import TwilioProvider from 'src/providers/twilio.provider';
import { AppContainer } from '../enums/app.container.enum';
import { IbloovSendGrid } from '../providers/sendgrid.mail';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { EmailCoreService } from './emails.core.service';
import { PushCoreService } from './pushNotification.core.service';
import { SmsCoreService } from './sms.core.service';
import { WhatsappCoreService } from './whatsapp.core.service';

@Module({
  controllers: [CoreController],
  providers: [
    EmailCoreService,
    PushCoreService,
    SmsCoreService,
    CoreService,
    WhatsappCoreService,
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
  imports: [],
  exports: [CoreService],
})
export class CoreModule {}
