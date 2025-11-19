import { Injectable, Logger } from '@nestjs/common';
import { WhatsappPayload } from 'src/interfaces/whatsapp/whatsappPayload';
import * as twilio from 'twilio';
import ISmsProvider from '../interfaces/sms/ISmsProvider.interface';
import IWhatsappProvider from '../interfaces/whatsapp/IWhatsappProvider.interface';

@Injectable()
export default class TwilioProvider implements ISmsProvider, IWhatsappProvider {
  private client: any;
  private readonly logger = new Logger(TwilioProvider.name);

  constructor() {
    this.initClient();
  }

  initClient() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  /**
   * Twilio implementation for sending whatsapp message
   * @param to
   * @param body
   * @param from
   * @returns
   */
  sendWhatsapp = (payload: WhatsappPayload) => {
    try {
      return this.client.messages
        .create({
          body: payload.body,
          to: `whatsapp:${payload.to}`,
          from: payload?.from || `whatsapp:+14155238886`,
          contentSid: payload?.contentSid,
          contentVariables: JSON.stringify(payload?.contentVariables),
        })

        .catch((err) => this.logger.log(err));
    } catch (error) {
      Logger.error(error);
    }
  };

  /**
   * Twilio implementation for sending sms
   * @param to
   * @param body
   * @param from
   * @returns
   */
  sendSms = (to: string, body: string, from?: string) => {
    try {
      return this.client.messages
        .create({
          to: this.formatPhoneNumber(to),
          body,
          from: from || 'Ibloov',
        })
        .catch((err) => this.logger.log(err));
    } catch (error) {
      Logger.error(error);
    }
  };

  // refactor this to accept other country codes
  formatPhoneNumber(phone_number: string) {
    if (phone_number.startsWith('0')) return `+234${phone_number.slice(1)}`;

    if (phone_number.startsWith('234')) return `+${phone_number}`;

    return phone_number;
  }
}
