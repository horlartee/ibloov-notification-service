import { Inject, Logger } from '@nestjs/common';
import { IQueueNotificationsPayload } from 'src/core/interfaces/core.notifications.interface';
import { mailTemplates } from 'src/definitions/constants';
import {
  PushNotificationMessages,
  SmsNotificationMessages,
} from 'src/enums/notification.messages';
import { IOneSignalPush } from 'src/interfaces/push/onesignal/onesignal.interface';
import { IBulkSmsPayload } from 'src/interfaces/sms/interface/smsPayload';
import { WhatsappPayload } from 'src/interfaces/whatsapp/whatsappPayload';
import QrUtil from 'src/utils/qr.util';
import UrlUtil from 'src/utils/url';
import { EmailCoreService } from './emails.core.service';
import { PushCoreService } from './pushNotification.core.service';
import { SmsCoreService } from './sms.core.service';
import { WhatsappCoreService } from './whatsapp.core.service';

export class CoreService {
  @Inject(EmailCoreService)
  private readonly emailCoreService: EmailCoreService;

  @Inject(PushCoreService)
  private readonly pushCoreService: PushCoreService;

  @Inject(SmsCoreService)
  private readonly smsCoreService: SmsCoreService;

  @Inject(WhatsappCoreService)
  private readonly whatsappCoreService: WhatsappCoreService;

  private readonly logger = new Logger(CoreService.name);

  async sendNotificationForInterWalletTransfer(
    payload: IQueueNotificationsPayload,
  ) {
    this.logger.log('incoming queue payload', payload);

    const buyerName = payload?.buyerPayload?.buyer_name;
    const merchantName = payload?.merchantPayload?.merchant_name;
    const buyerPlayerId = payload?.buyerPayload?.buyer_playerId;
    const merchantPlayerId = payload?.merchantPayload?.merchant_playerId;
    const merchantPhone = payload?.merchantPayload?.merchant_phone;
    const buyerPhone = payload?.buyerPayload?.buyer_phone;
    const merchantEmail = payload?.merchantPayload?.merchant_email;
    const buyerEmail = payload?.buyerPayload?.buyer_email;
    const amount = payload?.amount.toString();

    let pushMessage;
    let pushData: IOneSignalPush;
    let smsMessage;
    const smsArray: IBulkSmsPayload[] = [];
    const emailPayload = [];

    try {
      if (merchantEmail || buyerEmail) {
        try {
          if (merchantEmail) {
            emailPayload.push({
              to: merchantEmail,
              templateId: '',
              templateData: {},
            });

            if (buyerEmail) {
              emailPayload.push({
                to: buyerEmail,
                templateId: '',
                templateData: {},
              });
            }

            this.logger.log('emailPayloadForWalletTransfer', emailPayload);
            //await this.emailCoreService.sendBulkEmails(emailPayload);
          }
        } catch (error) {
          this.logger.log('Send Email Error', error);
        }
      }

      if (buyerPlayerId || merchantPlayerId) {
        try {
          if (buyerPlayerId) {
            pushMessage = PushNotificationMessages.BUYER_WALLET_DEBIT.replace(
              '{full_name}',
              buyerName,
            ).replace('{amount}', amount);

            pushData = {
              include_player_ids: [buyerPlayerId],
              contents: { en: `${pushMessage}` },
            };
            this.logger.log(
              'BuyerPushNotificationPayloadForWalletTransfer',
              pushData,
            );

            await this.pushCoreService.createPushNotification(pushData);
          }

          if (merchantPlayerId) {
            pushMessage =
              PushNotificationMessages.MERCHANT_WALLET_CREDIT.replace(
                '{full_name}',
                merchantName,
              ).replace('{amount}', amount);

            pushData = {
              include_player_ids: [merchantPlayerId],
              contents: { en: `${pushMessage}` },
            };

            this.logger.log(
              'MerchantPushNotificationPayloadForWalletTransfer',
              pushData,
            );

            await this.pushCoreService.createPushNotification(pushData);
          }
        } catch (error) {
          this.logger.log('sendPushNotificationError', error);
        }
      }

      if (merchantPhone || buyerPhone) {
        try {
          if (buyerPhone) {
            smsMessage = SmsNotificationMessages.BUYER_WALLET_DEBIT.replace(
              '{full_name}',
              buyerName,
            ).replace('{amount}', amount);

            smsArray.push({
              to: [buyerPhone],
              message: smsMessage,
            });
          }

          if (merchantPhone) {
            this.logger.log('here bro');

            smsMessage = SmsNotificationMessages.MERCHANT_WALLET_CREDIT.replace(
              '{full_name}',
              merchantName,
            ).replace('{amount}', amount);

            smsArray.push({
              to: [merchantPhone],
              message: smsMessage,
            });
          }
          this.logger.log('smsArrayPayload', smsArray);

          await this.smsCoreService.sendSmsWithArrayPayload(smsArray);
        } catch (error) {
          this.logger.log('sendSmsError', error);
        }
      }

      return true;
    } catch (error) {
      this.logger.log(
        'sendNotificationForForInterWalletTransfer Error \n',
        error,
      );
      return true;
    }
  }

  async sendWalletDebitNotification(payload: {
    amount: string | number;
    walletBalance: string | number;
    name: string;
    phoneNumber?: string;
    email?: string;
    playerId?: string;
  }): Promise<boolean> {
    try {
      let message = `Wonderland transaction notification: \n`;
      this.logger.log(
        `sending notifications for wallet debit for user: ${payload.name}`,
      );
      const name =
        !payload.name || payload.name.includes('null') ? null : payload.name;

      message = message.concat(
        `Hello ${name || ''}, You wallet has been Debited \n`,
      );

      if (payload.amount) {
        message = message.concat(`Debit: ₦${payload.amount}\n`);
      }

      if (payload.walletBalance) {
        message = message.concat(`bal: ₦${payload.walletBalance}`);
      }

      if (payload.phoneNumber && message) {
        this.logger.log(`sms sent for DR notification: ${payload.phoneNumber}`);
        this.smsCoreService.sendOneSms({
          to: payload.phoneNumber,
          message,
        });
      }

      if (payload.playerId && message) {
        this.logger.log(`PN sent for DR notification: ${payload.playerId}`);
        this.pushCoreService.createPushNotification({
          contents: {
            en: message,
          },
          include_player_ids: [payload.playerId],
        });
      }
      this.logger.log(
        `sending notifications for wallet debit completed for ${payload.name}`,
      );
      return true;
    } catch (error) {
      this.logger.log('sendWalletDebitNotification Error \n', error);
      return true;
    }
  }

  async sendWalletCreditNotification(payload: {
    amount: string | number;
    walletBalance: string | number;
    name: string;
    phoneNumber?: string;
    email?: string;
    playerId?: string;
  }): Promise<boolean> {
    try {
      let message = `Wonderland transaction notification: \n`;
      this.logger.log(
        `sending notifications for wallet credit for user with payload:`,
        payload,
      );

      const name =
        !payload.name || payload.name.includes('null') ? null : payload.name;

      message = message.concat(
        `Hello ${name || ''}, You wallet has been credited \n`,
      );

      if (payload.amount) {
        message = message.concat(`Credit: ₦${payload.amount}\n`);
      }
      if (payload.walletBalance) {
        message = message.concat(`bal: ₦${payload.walletBalance}`);
      }

      if (payload.phoneNumber && message) {
        this.logger.log(`sms sent for CR notification: ${payload.phoneNumber}`);
        this.smsCoreService.sendOneSms({
          to: payload.phoneNumber,
          message,
        });
      }

      if (payload.playerId && message) {
        this.logger.log(`PN sent for CR notification: ${payload.playerId}`);
        this.pushCoreService.createPushNotification({
          contents: {
            en: message,
          },
          include_player_ids: [payload.playerId],
        });
      }

      if (payload.email) {
        const emailData = {
          email: payload?.email,
          subjectOrTemplateId: mailTemplates.POSTMARK_MERCHANT_WALLET_CREDIT,
          htmlOrTemplate: {
            beneficiary_name: name,
            logo: '',
            amount: payload?.amount,
            date: new Date().toString().split('G')[0],
            balance: payload?.walletBalance,
          },
        };

        this.logger.log(
          `Email sent for CR notification with payload`,
          emailData,
        );

        this.emailCoreService.sendOneEmail(emailData);
      }
      this.logger.log(
        `sending notifications for wallet credit completed for ${payload.name}`,
      );
      return true;
    } catch (error) {
      this.logger.log('sendWalletCreditNotification Error \n', error);
      return true;
    }
  }

  async sendAnonUserWalletCreditNotification(payload: {
    amount: string | number;
    walletBalance: string | number;
    name: string;
    ssoId: string;
    phoneNumber?: string;
    email?: string;
    playerId?: string;
  }): Promise<boolean> {
    try {
      let message = `Wonderland transaction notification: \n`;
      this.logger.log(
        `sending notifications for wallet credit for anon user with payload:`,
        payload,
      );

      const name =
        !payload.name || payload.name.includes('null') ? null : payload.name;

      message = message.concat(
        `Hello ${name || ''}, You wallet has been credited. \n`,
      );

      if (payload.amount) {
        message = message.concat(`CR: ₦${payload.amount}\n`);
      }
      if (payload.walletBalance) {
        message = message.concat(`bal: ₦${payload.walletBalance}`);
      }

      if (payload.phoneNumber && message) {
        this.logger.log(`sms sent for CR notification: ${payload.phoneNumber}`);
        this.smsCoreService.sendOneSms({
          to: payload.phoneNumber,
          message,
        });
      }

      if (payload.playerId && message) {
        this.logger.log(`PN sent for CR notification: ${payload.playerId}`);
        this.pushCoreService.createPushNotification({
          contents: {
            en: message,
          },
          include_player_ids: [payload.playerId],
        });
      }

      if (payload.email) {
        const url = UrlUtil.generateAnonUserUrl(payload?.ssoId);
        const qrCode = await QrUtil.generateQrCode(url);
        const formattedQrCode = qrCode.replace('data:image/png;base64,', '');

        const emailData = {
          email: payload?.email,
          subjectOrTemplateId: mailTemplates.POSTMARK_ANONYMOUS_WALLET_CREDIT,
          htmlOrTemplate: {
            beneficiary_name: payload?.name,
            logo: '',
            amount: payload?.amount,
            date: new Date().toString().split('G')[0],
            balance: payload?.walletBalance,
          },
          attachments: [
            {
              Name: 'QRCode.png',
              Content: formattedQrCode,
              ContentType: 'plain/text',
            },
          ],
        };

        this.logger.log(
          `Email sent for Anonymous CR notification with payload`,
          emailData,
        );

        this.emailCoreService.sendOneEmail(emailData);
      }
      this.logger.log(
        `sending notifications for wallet credit completed for ${payload.name}`,
      );
      return true;
    } catch (error) {
      this.logger.log('sendAnonUserWalletCreditNotification Error \n', error);
      return true;
    }
  }

  async sendVirtualAccountCreatedNotification(payload: {
    accountNumber: string;
    name: string;
    phoneNumber: string;
    email: string;
    playerId: string;
    client: string;
  }): Promise<boolean> {
    try {
      const message = `Hello ${payload.name || ''}, Your ${
        payload.client || ''
      } account number has been created successfully and you can start receiving payment.`;

      if (payload.phoneNumber && message) {
        this.logger.log(`SMS sent for DVA CreatedNotification`);
        this.smsCoreService.sendOneSms({
          to: payload.phoneNumber,
          message,
        });
      }

      if (payload.playerId && message) {
        this.logger.log(`PN sent for CR notification: ${payload.playerId}`);
        this.pushCoreService.createPushNotification({
          contents: {
            en: message,
          },
          include_player_ids: [payload.playerId],
        });
      }
      this.logger.log(
        `sending notifications for wallet credit completed for ${payload.name}`,
      );
      return true;
    } catch (error) {
      this.logger.log('sendWalletCreditNotification Error \n', error);
      return true;
    }
  }

  async sendWhatsappMessage(payload: WhatsappPayload) {
    try {
      return await this.whatsappCoreService.sendWhatsapp(payload);
    } catch (error) {
      Logger.log('SendWhatsappMessage', error);
    }
  }
}
