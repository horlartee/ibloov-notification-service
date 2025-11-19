import { MailOptions } from './../interfaces/common.interface';
import { Injectable, Logger } from '@nestjs/common';
import IEmailProvider from 'src/interfaces/email/IEmailProvider.interface';
import * as postmark from 'postmark';

@Injectable()
export class IbloovPostmark implements IEmailProvider {
  private postMarkClient: any;
  private readonly logger = new Logger(IbloovPostmark.name);

  constructor() {
    this.postMarkClient = new postmark.ServerClient(
      process.env.POSTMARK_API_KEY,
    );
  }

  sendMultipleWithArray(
    payload: {
      from?: string;
      to: any;
      templateId: string;
      templateData?: Record<string, any>;
      attachments?: any[];
    }[],
  ): Promise<void> {
    const batchWithTemplatesData = [];

    payload.forEach((mailRequest) => {
      const mailData = {
        TemplateModel: mailRequest.templateData,
        TemplateId: mailRequest.templateId,
        To: mailRequest.to,
        from: mailRequest.from || process.env.EMAIL_FROM,
        Cc: null,
        Attachments: mailRequest.attachments,
      };
      batchWithTemplatesData.push(mailData);
    });

    try {
      return this.postMarkClient.sendEmailBatchWithTemplates(
        batchWithTemplatesData,
      );
    } catch (error) {
      this.logger.log('postmark :: sendMultipleWithArray error \n', error);
    }
  }

  sendMail = async (
    to: string,
    subjectOrTemplateId: string,
    templateDataOrHtml?: any,
    options?: MailOptions,
    attachments?: any[],
  ) => {
    try {
      return this.sendMailTemplate(
        to,
        subjectOrTemplateId,
        templateDataOrHtml,
        options,
        attachments,
      );
    } catch (error) {
      this.logger.log('postmark :: sendMail error \n', error);
    }
  };

  sendMultiple = async (
    tos: string[],
    subjectOrTemplateId: string,
    templateDataOrHtml?: any,
    options?: MailOptions,
    attachments?: any[],
  ) => {
    try {
      return this.sendMultipleMailTemplate(
        tos,
        subjectOrTemplateId,
        templateDataOrHtml,
        options,
        attachments,
      );
    } catch (error) {
      this.logger.log('postmark :: sendMultiple error \n', error);
    }
  };

  private sendMultipleMailTemplate = async (
    emails: string[],
    templateId: string,
    templateData?: any,
    options?: MailOptions,
    attachments?: any[],
  ) => {
    const messages = [
      ...emails.map((email) => {
        const msg = {
          TemplateModel: templateData,
          TemplateId: templateId,
          to: email,
          from: process.env.EMAIL_FROM,
          Cc: null,
          Attachments: attachments,
        };
        if (options) {
          if (options.cc) msg.Cc = options.cc;

          if (options.fromEmail) msg.from = options.fromEmail;
        }
        return msg;
      }),
    ];

    try {
      return this.postMarkClient.sendEmailBatchWithTemplates(messages);
    } catch (error) {
      this.logger.log('postmark :: sendMultipleMailTemplate error\n', error);
    }
  };

  private sendMailTemplate = async (
    to: string,
    templateId: string | number,
    templateData?: any,
    options?: MailOptions,
    attachments?: any[],
  ) => {
    const msg = {
      TemplateModel: templateData,
      TemplateId: templateId,
      To: to,
      from: process.env.EMAIL_FROM,
      Cc: null,
      Attachments: attachments,
    };
    if (options) {
      if (options.cc) msg.Cc = options.cc;

      if (options.fromEmail) msg.from = options.fromEmail;
    }

    try {
      return this.postMarkClient.sendEmailWithTemplate(msg);
    } catch (error) {
      this.logger.log('postmark :: sendMailTemplate error \n', error);
    }
  };
}
