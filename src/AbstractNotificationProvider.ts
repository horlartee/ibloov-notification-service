import { CanSend } from './interfaces/CanSend.abstract';
import { MailOptions } from './interfaces/common.interface';
import ICanSend from './interfaces/ICanSend.interface';

export default abstract class AbstractNotificationProvider implements ICanSend {
  protected channel: string;
  private canSend: CanSend;

  constructor({ canSend }) {
    this.canSend = canSend;
  }

  getSmsServiceProvider() {
    return this.canSend.getSmsServiceProvider();
  }

  getEmailServiceProvider() {
    return this.canSend.getEmailServiceProvider();
  }

  getWhatsappServiceProvider() {
    return this.canSend.getWhatsappServiceProvider();
  }

  getPushServiceProvider() {
    return this.canSend.getPushServiceProvider();
  }

  abstract sendSms(to: string, body: string, from: string, channel): this;

  abstract sendWhatsapp(to: string, body: string, from?: string): this;

  abstract sendPush(notification: Record<string, unknown>): this;

  abstract sendEmail(
    to: string,
    subjectOrTemplateId: string,
    templateDataOrHtml?: any,
    options?: MailOptions,
  ): this;
}
