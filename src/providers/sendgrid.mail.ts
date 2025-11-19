import { MailOptions } from './../interfaces/common.interface';
import { Injectable, Logger } from '@nestjs/common';
import IEmailListManager from '../interfaces/email/IEmailListManager.interface';
import IEmailProvider from 'src/interfaces/email/IEmailProvider.interface';
import MailContact from '../interfaces/contact';
import * as sgMail from '@sendgrid/mail';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('@sendgrid/client');

@Injectable()
export class IbloovSendGrid implements IEmailProvider, IEmailListManager {
  private readonly logger = new Logger(IbloovSendGrid.name);
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    client.setApiKey(process.env.SENDGRID_API_KEY);
  }

  /**
   *
   * @param to
   * @param subjectOrTemplateId
   * @param templateDataOrHtml
   * @param options
   * @returns
   */
  sendMail = async (
    to: string,
    subjectOrTemplateId: string,
    templateDataOrHtml?: any,
    options?: MailOptions,
  ) => {
    if (typeof templateDataOrHtml === 'string') {
      return this.sendMailHtml(
        to,
        subjectOrTemplateId,
        templateDataOrHtml,
        options,
      );
    }
    return this.sendMailTemplate(
      to,
      subjectOrTemplateId,
      templateDataOrHtml,
      options,
    );
  };

  /**
   * sendgrid implementation of send Iprovider sendMultiple
   * @param influencer Object
   * @param follower Object
   */
  sendMultiple = async (
    tos: string[],
    subjectOrTemplateId: string,
    templateDataOrHtml?: any,
    options?: MailOptions,
  ) => {
    if (typeof templateDataOrHtml === 'string') {
      return this.sendMultipleHtml(
        tos,
        subjectOrTemplateId,
        templateDataOrHtml,
        options,
      );
    }
    return this.sendMultipleMailTemplate(
      tos,
      subjectOrTemplateId,
      templateDataOrHtml,
      options,
    );
  };

  private sendMultipleHtml = async (
    emails: string[],
    subject: string,
    html: string,
    options?: MailOptions,
  ) => {
    const env: string = process.env.NODE_ENV || 'prod';
    const showEnv =
      env.toLowerCase() === 'prod' || env.toLowerCase() === 'production'
        ? ''
        : `${env} - `;

    const msg = {
      subject: `${showEnv}${subject}`,
      to: emails,
      html,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.SENDER,
      },
      cc: null,
    };

    if (options) {
      if (options.cc) msg.cc = options.cc;

      if (options.fromName) msg.from.name = options.fromName;

      if (options.fromEmail) msg.from.email = options.fromEmail;
    }

    return sgMail.sendMultiple(msg);
  };

  private sendMultipleMailTemplate = async (
    emails: string[],
    templateId: string,
    templateData?: any,
    options?: MailOptions,
  ) => {
    const msg = {
      dynamic_template_data: templateData,
      to: emails,
      templateId,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.SENDER,
      },
      cc: null,
    };

    if (options) {
      if (options.cc) msg.cc = options.cc;

      if (options.fromName) msg.from.name = options.fromName;

      if (options.fromEmail) msg.from.email = options.fromEmail;
    }

    return sgMail.sendMultiple(msg);
  };

  private sendMailHtml = async (
    to: string,
    subject: string,
    html: string,
    options?: MailOptions,
  ) => {
    const env: string = process.env.NODE_ENV || 'prod';
    const showEnv =
      env.toLowerCase() === 'prod' || env.toLowerCase() === 'production'
        ? ''
        : `${env} - `;

    const msg = {
      subject: `${showEnv}${subject}`,
      to,
      html,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.SENDER,
      },
      cc: null,
    };

    if (options) {
      if (options.cc) msg.cc = options.cc;

      if (options.fromName) msg.from.name = options.fromName;

      if (options.fromEmail) msg.from.email = options.fromEmail;
    }

    return sgMail.send(msg);
  };

  /**
   * send email
   * @param to - the recepient of the mail
   * @param templateId - the id of the template to use
   * @param templateData (optional) - dynamic data associated with the template
   */
  private sendMailTemplate = async (
    to: string,
    templateId: string,
    templateData?: any,
    options?: MailOptions,
  ) => {
    const msg = {
      dynamic_template_data: templateData,
      to,
      templateId,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.SENDER,
      },
      cc: null,
    };

    if (options) {
      if (options.cc) msg.cc = options.cc;

      if (options.fromName) msg.from.name = options.fromName;

      if (options.fromEmail) msg.from.email = options.fromEmail;
    }

    return sgMail.send(msg);
  };

  sendMultipleWithArray(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload: {
      from: string;
      to: any;
      templateId: string;
      templateData?: Record<string, any>;
    }[],
  ): void {
    //not implemented
  }

  createMailingList(payload: { name: string }) {
    try {
      const data = {
        name: payload.name,
      };

      const request = {
        url: `/v3/marketing/lists`,
        method: 'POST',
        body: data,
      };

      client
        .request(request)
        .then(([response, body]) => {
          this.logger.log('code', response.statusCode);
          this.logger.log('body', response.body);
        })
        .catch((error) => {
          this.logger.error(error?.response?.body);
        });
    } catch (error) {
      this.logger.error('createList error \n', error);
    }
  }

  addToMailingList(users: Array<MailContact>) {
    try {
      const contacts = [];

      users.forEach((user) => {
        const [first, last] = user.name ? user.name.split(' ') : ['', ''];

        const userContact = {
          email: user.email,
          first_name: first,
          last_name: last,
          phone_number: user?.phone_number,
          custom_fields: {},
        };

        contacts.push(userContact);
      });
      const data = { contacts };

      const request = {
        url: `/v3/marketing/contacts`,
        method: 'PUT',
        body: data,
      };

      client
        .request(request)
        .then(([response, body]) => {
          this.logger.log('body', response.body);
        })
        .catch((error) => {
          this.logger.error(error?.response?.body);
        });
    } catch (error) {
      this.logger.error('addToList error \n', error);
    }
  }
}
