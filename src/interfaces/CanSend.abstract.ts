import IEmailServiceProvider from './email/IEmailServiceProvider.interface';
import ICanSend from './ICanSend.interface';
import IPushServiceProvider from './push/IPushServiceProvider.interface';
import ISmsServiceProvider from './sms/ISmsServiceProvider.interface';
import IWhatsappServiceProvider from './whatsapp/IWhatsappServiceProvider.interface';

export abstract class CanSend implements ICanSend {
  private smsServiceProvider: ISmsServiceProvider;
  private whatsappServiceProvider: IWhatsappServiceProvider;
  private pushServiceProvider: IPushServiceProvider;
  private emailServiceProvider: IEmailServiceProvider;

  constructor({
    emailServiceProvider,
    pushServiceProvider,
    smsServiceProvider,
    whatsappServiceProvider,
  }) {
    this.emailServiceProvider = emailServiceProvider;
    this.pushServiceProvider = pushServiceProvider;
    this.smsServiceProvider = smsServiceProvider;
    this.whatsappServiceProvider = whatsappServiceProvider;
  }

  getSmsServiceProvider(): ISmsServiceProvider {
    return this.smsServiceProvider;
  }

  getWhatsappServiceProvider(): IWhatsappServiceProvider {
    return this.whatsappServiceProvider;
  }

  getPushServiceProvider(): IPushServiceProvider {
    return this.pushServiceProvider;
  }

  getEmailServiceProvider(): IEmailServiceProvider {
    return this.emailServiceProvider;
  }
}
