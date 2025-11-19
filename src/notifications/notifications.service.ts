import { Inject, Logger } from '@nestjs/common';
import { CoreController } from 'src/core/core.controller';
import { EmailCoreService } from 'src/core/emails.core.service';
import { PushCoreService } from 'src/core/pushNotification.core.service';
import { IbloovEvent } from 'src/enums/events';
import { CoreService } from '../core/core.service';
import { HoshistechQueueModel } from '../models/hoshistech-queue-model';

export class NotificationsService {
  @Inject(CoreController) private readonly coreController: CoreController;
  @Inject(CoreService) private readonly coreService: CoreService;
  @Inject(EmailCoreService) private readonly emailCoreService: EmailCoreService;
  @Inject(PushCoreService) private readonly pushCoreService: PushCoreService;
  private readonly logger = new Logger(NotificationsService.name);

  async process(payload: HoshistechQueueModel<any>) {
    try {
      this.logger.log('received queue payload \n', payload);
      const event: string = payload?.pattern;
      this.logger.log('payload event: ', event);

      /**
       * NB: Some handlers call the coreController while some call the services directly
       * The ones that call the coreController have some logic within the controllers hence the need to call them
       * The ones that call the coreController should return the response from the coreController
       * While the ones that call the service should return boolean (even tho return any truthy should work)
       */
      switch (event?.toLowerCase()) {
        case IbloovEvent.USER_CREATED?.toLowerCase():
          this.logger.log('calling userCreatedConsumer...');
          return await this.coreController.userCreated(payload.data);
          break;

        case IbloovEvent.RESET_PASSWORD.toLowerCase():
          this.logger.log('calling resetPasswordConsumer...');
          await this.emailCoreService.sendResetPasswordMail(payload.data);
          return true;
          break;

        case IbloovEvent.BULK_EMAIL.toLowerCase():
          this.logger.log('calling sendBulkEmailsConsumer...');
          await this.emailCoreService.sendBulkEmails(payload.data);
          return true;
          break;

        case IbloovEvent.SINGLE_MAIL.toLowerCase():
          this.logger.log('calling sendSingleMail...');
          return await this.emailCoreService.sendOneEmail(payload.data);
          break;

        case IbloovEvent.CREATE_MAILING_LIST.toLowerCase():
          this.logger.log('calling createMailingListConsumer...');
          return await this.emailCoreService.createNewMailingList(payload.data);
          break;

        case IbloovEvent.ADD_TO_MAILING_LIST.toLowerCase():
          this.logger.log('calling addToMailListConsumer...');
          return await this.emailCoreService.addToMailingList(payload.data);
          break;

        case IbloovEvent.SEND_PUSH_NOTIFICATION.toLowerCase():
          this.logger.log('calling sendPushNotificationConsumer...');
          return await this.pushCoreService.createPushNotification(
            payload.data,
          );
          break;

        case IbloovEvent.DEBIT_WALLET.toLowerCase():
          this.logger.log('calling sendWalletDebitNotification...');
          return await this.coreService.sendWalletDebitNotification(
            payload.data,
          );
          break;

        case IbloovEvent.CREDIT_WALLET.toLowerCase():
          this.logger.log('calling sendWalletCreditNotification...');
          return await this.coreService.sendWalletCreditNotification(
            payload.data,
          );
          break;

        case IbloovEvent.WALLET_EXCHANGE.toLowerCase():
          this.logger.log('calling sendInterWalletNotification...');
          return await this.coreService.sendNotificationForInterWalletTransfer(
            payload.data,
          );
          break;

        case IbloovEvent.VIRTUAL_ACCOUNT_CREATED_NOTIFICATION.toLowerCase():
          this.logger.log('calling sendVirtualAccountCreatedNotification...');
          return await this.coreService.sendVirtualAccountCreatedNotification(
            payload.data,
          );
          break;

        case IbloovEvent.ANONYMOUS_USER_WALLET_CREDIT_NOTIFICATION.toLowerCase():
          this.logger.log('calling sendAnonUserWalletCreditNotification...');
          return await this.coreService.sendAnonUserWalletCreditNotification(
            payload.data,
          );
          break;

        default:
          this.logger.log(
            `No Consumer attached to event ${event} with payload \n %o `,
            payload,
          );
          return false;
          break;
      }
    } catch (error) {
      this.logger.error('queue consumer error \n', error);
      return false;
    }
  }

}
