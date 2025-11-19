import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import { MailOptions } from 'src/interfaces/common.interface';
import IEmailProvider from 'src/interfaces/email/IEmailProvider.interface';

@Injectable()
export class IbloovNodeMailer implements IEmailProvider {
  private transporter: any;
  constructor() {
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      pool: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  sendMail = async (
    to: string,
    subject: string,
    html: string,
    options?: MailOptions,
  ) => {
    const env: string = process.env.NODE_ENV || 'prod';
    const showEnv =
      env.toLowerCase() == 'prod' || env.toLowerCase() == 'production'
        ? ''
        : `${env} - `;

    const msg = {
      subject: `${showEnv}${subject}`,
      to,
      html,
      from: `"${process.env.SENDER}" <${process.env.EMAIL_FROM}>`,
    };

    if (options) {
      if (options.cc) msg['cc'] = options.cc;

      if (options.fromName)
        msg['from'] = `"${options.fromName}" <${process.env.EMAIL_FROM}>`;
    }

    return await this.transporter.sendMail(msg);
  };

  /**
   * nodemailer implementation of send Iprovider.sendMultiple
   * @param tos
   * @param subject
   * @param message
   */
  sendMultiple = async (tos: any, subject: any, message: any) => {
    const bulkMailComposer = [];

    tos.map((to) => {
      const mail = {
        from: `"${process.env.SENDER}" <${process.env.EMAIL_FROM}>`,
        html: message,
        to,
        subject,
      };

      bulkMailComposer.push(mail);
    });

    return await this.transporter.sendMail(bulkMailComposer);
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
}
