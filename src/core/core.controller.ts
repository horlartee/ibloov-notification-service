import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IbloovEvent } from 'src/enums/events';
import { IOneSignalPush } from 'src/interfaces/push/onesignal/onesignal.interface';
import {
  IBulkSmsPayload,
  IOneSmsPayload,
} from 'src/interfaces/sms/interface/smsPayload';
import { WhatsappPayload } from 'src/interfaces/whatsapp/whatsappPayload';
import MailContact from '../interfaces/contact';
import { CoreService } from './core.service';
import { EmailCoreService } from './emails.core.service';
import { PushCoreService } from './pushNotification.core.service';
import { SmsCoreService } from './sms.core.service';
import { WhatsappCoreService } from './whatsapp.core.service';

@Controller('notification')
export class CoreController {
  private readonly logger = new Logger(CoreController.name);

  constructor(
    private readonly emailCoreService: EmailCoreService,
    private readonly pushCoreService: PushCoreService,
    private readonly smsCoreService: SmsCoreService,
    private readonly whatsappCoreService: WhatsappCoreService,

    private readonly coreService: CoreService,
  ) {}

  @EventPattern(IbloovEvent.USER_CREATED)
  async userCreated(@Payload() payload: any) {
    try {
      this.logger.log(
        'userCreated called with payload \n',
        JSON.stringify(payload),
      );
      await this.emailCoreService.sendVerificationMail(payload);
      this.emailCoreService.addToMailingList([payload]);

      return true;
    } catch (error) {
      this.logger.error('CoreController :: userCreated error', error);
      return false;
    }
  }

  @EventPattern(IbloovEvent.RESET_PASSWORD)
  async resetPassword(@Payload() payload: any) {
    try {
      this.logger.log(
        'resetPassword called with payload \n',
        JSON.stringify(payload),
      );
      await this.emailCoreService.sendResetPasswordMail(payload);
      return true;
    } catch (error) {
      this.logger.error('CoreController :: resetPassword error', error);
      return false;
    }
  }

  @EventPattern(IbloovEvent.BULK_EMAIL)
  async sendBulkMails(@Payload() payload: any) {
    try {
      this.logger.log(
        'sendBulkMails called with payload \n',
        JSON.stringify(payload),
      );
      await this.emailCoreService.sendBulkEmails(payload);
      return true;
    } catch (error) {
      this.logger.error('CoreController :: sendBulkMails error', error);
      return false;
    }
  }

  @EventPattern(IbloovEvent.SINGLE_MAIL)
  async sendOneEmail(@Payload() payload: any) {
    try {
      this.logger.log(
        'sendOneEmail called with payload \n',
        JSON.stringify(payload),
      );
      await this.emailCoreService.sendOneEmail(payload);
      return true;
    } catch (error) {
      this.logger.error('CoreController :: sendOneEmail error', error);
      return false;
    }
  }

  @EventPattern(IbloovEvent.CREATE_MAILING_LIST)
  async createMailingList(@Payload() payload: any) {
    try {
      this.logger.log(
        'createMailingList called with payload \n',
        JSON.stringify(payload),
      );
      await this.emailCoreService.createNewMailingList(payload);
      return true;
    } catch (error) {
      this.logger.error('CoreController :: createMailingList error', error);
      return false;
    }
  }

  @EventPattern(IbloovEvent.ADD_TO_MAILING_LIST)
  async addToMailList(@Payload() payload: MailContact[]) {
    try {
      this.logger.log(
        'addToMailList called with payload \n',
        JSON.stringify(payload),
      );
      await this.emailCoreService.addToMailingList(payload);
      return true;
    } catch (error) {
      this.logger.error('CoreController :: addToMailList error', error);
      return false;
    }
  }

  async sendInterWalletNotification(payload: any) {
    try {
      this.logger.log(
        'sendInterWalletNotification called with payload \n',
        JSON.stringify(payload),
      );
      await this.coreService.sendNotificationForInterWalletTransfer(payload);
      return true;
    } catch (error) {
      this.logger.error(
        'CoreController :: sendInterWalletNotification error',
        error,
      );
      return false;
    }
  }

  @EventPattern(IbloovEvent.SEND_PUSH_NOTIFICATION)
  async sendPushNotification(@Payload() payload: IOneSignalPush) {
    try {
      this.logger.log(
        'sendPushNotification called with payload \n',
        JSON.stringify(payload),
      );
      await this.pushCoreService.createPushNotification(payload);
      return true;
    } catch (error) {
      this.logger.error('CoreController :: sendPushNotification error', error);
      return false;
    }
  }

  async sendOneSms(@Payload() payload: IOneSmsPayload) {
    try {
      this.logger.log(
        'sendOneSms called with payload \n',
        JSON.stringify(payload),
      );
      return await this.smsCoreService.sendOneSms(payload);
    } catch (error) {
      this.logger.error('CoreController :: sendOneSms error', error);
      return false;
    }
  }

  async sendBulkSms(@Payload() payload: IBulkSmsPayload) {
    try {
      this.logger.log(
        'sendBulkSms called with payload \n',
        JSON.stringify(payload),
      );
      return await this.smsCoreService.sendBulkSms(payload);
    } catch (error) {
      this.logger.error('CoreController :: sendBulkSms error', error);
      return false;
    }
  }

  @EventPattern(IbloovEvent.SEND_BULK_SMS_WITH_ARRAY)
  async sendSmsWithArrayPayload(@Payload() payload: any) {
    try {
      this.logger.log(
        'sendSmsWithArrayPayload called with payload \n',
        JSON.stringify(payload),
      );
      return await this.smsCoreService.sendSmsWithArrayPayload(payload);
    } catch (error) {
      this.logger.error(
        'CoreController :: sendSmsWithArrayPayload error',
        error,
      );
      return false;
    }
  }

  @EventPattern(IbloovEvent.AUTOMATED_WHATSAPP_MESSAGE)
  async sendWhatsappMessage(@Payload() payload: WhatsappPayload) {
    try {
      this.logger.log(
        'sendWhatsappMessagePayload called with payload \n',
        JSON.stringify(payload),
      );
      return await this.whatsappCoreService.sendWhatsapp(payload);
    } catch (error) {
      this.logger.error(
        'CoreController :: sendWhatsappMessagePayload error',
        error,
      );
      return false;
    }
  }

}
