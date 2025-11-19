import { Inject, Injectable, Logger } from '@nestjs/common';
import { mailTemplates } from 'src/definitions/constants';
import { AppContainer } from '../enums/app.container.enum';
import MailContact from '../interfaces/contact';
import IEmailListManager from '../interfaces/email/IEmailListManager.interface';
import IEmailProvider from '../interfaces/email/IEmailProvider.interface';

@Injectable()
export class EmailCoreService {
  private readonly logger = new Logger(EmailCoreService.name);
  constructor(
    @Inject(AppContainer.EMAIL_PROVIDER)
    private readonly mailProvider: IEmailProvider,

    @Inject(AppContainer.MAIL_LIST_PROVIDER)
    private readonly mailingListProvider: IEmailListManager,
  ) {}

  async sendVerificationMail(payload: any) {
    try {
      return this.mailProvider.sendMail(
        payload.email,
        mailTemplates.POSTMARK_VERIFICATION_MAIL,
        payload,
      );
    } catch (error) {
      this.logger.error(
        'EmailCoreService :: sendVerificationMail error \n',
        error,
      );
      return false;
    }
  }

  async sendResetPasswordMail(payload: any) {
    try {
      return this.mailProvider.sendMail(
        payload.email,
        mailTemplates.POSTMARK_RESET_PASSWORD,
        payload,
      );
    } catch (error) {
      this.logger.error(
        'EmailCoreService :: sendResetPasswordMail error \n',
        error.message || error,
      );
      return false;
    }
  }

  async sendBulkEmails(payload: any) {
    try {
      if (Array.isArray(payload)) {
        return this.mailProvider.sendMultipleWithArray(payload);
      } else {
        const {
          emails,
          subjectOrTemplateId,
          htmlOrTemplate,
          options,
          attachments,
        } = payload;

        return this.mailProvider.sendMultiple(
          emails,
          subjectOrTemplateId,
          htmlOrTemplate,
          options,
          attachments,
        );
      }
    } catch (error) {
      this.logger.error('EmailCoreService :: sendBulkEmails error \n', error);
      return false;
    }
  }

  async sendOneEmail(payload: any) {
    try {
      const {
        email,
        subjectOrTemplateId,
        htmlOrTemplate,
        attachments,
        options,
      } = payload;
      return this.mailProvider.sendMail(
        email,
        subjectOrTemplateId,
        htmlOrTemplate,
        options,
        attachments,
      );
    } catch (error) {
      this.logger.error(
        'sendOneEmail error \n',
        error?.message || error.response || error?.response?.data | error,
      );
      return false;
    }
  }

  async createNewMailingList(payload: { name: string }) {
    try {
      this.logger.log('createNewMailingList payload', payload);
      return this.mailingListProvider.createMailingList(payload);
    } catch (error) {
      this.logger.error(
        'EmailCoreService :: createNewMailingList error \n',
        error.message || error,
      );
      return false;
    }
  }

  async addToMailingList(payload: MailContact[]) {
    try {
      this.logger.log('addToMailingList payload', payload);
      return this.mailingListProvider.addToMailingList(payload);
    } catch (error) {
      this.logger.error(
        'EmailCoreService :: addToMailingList service error \n',
        error,
      );
      return false;
    }
  }
}
