import { Injectable, Logger } from '@nestjs/common';
import {
  IBulkSmsPayload,
  IOneSmsPayload,
} from 'src/interfaces/sms/interface/smsPayload';
import ISmsProvider from 'src/interfaces/sms/ISmsProvider.interface';
import { PhoneNumberUtil } from 'src/utils/phoneNumber.utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AfricasTalking = require('africastalking')({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});
const sms = AfricasTalking.SMS;

@Injectable()
export class IbloovATSms implements ISmsProvider {
  private readonly logger = new Logger(IbloovATSms.name);
  sendOneSms = async (data: IOneSmsPayload) => {
    const formattedPhoneNumber = PhoneNumberUtil.validatePhoneNumber(data.to);

    this.logger.log('formattedPhoneNumbers', formattedPhoneNumber);

    if (!formattedPhoneNumber) return;

    const smsData = {
      to: formattedPhoneNumber,
      message: data.message,
      from: data.from || process.env.SMS_FROM,
    };

    this.logger.log('Single SMS', smsData);

    const smsRequest = await sms.send(smsData);

    this.logger.log('smsRequest', smsRequest);

    return smsRequest;
  };

  sendBulkSms = async (data: IBulkSmsPayload) => {
    const formattedPhoneNumbers = data.to.map((phone) =>
      PhoneNumberUtil.validatePhoneNumber(phone),
    );

    this.logger.log('formattedPhoneNumbers', formattedPhoneNumbers);

    const smsData = {
      to: formattedPhoneNumbers,
      message: data.message,
      from: process.env.SMS_FROM,
    };

    this.logger.log('Bulk Sms', smsData);

    const smsRequest = await sms.send(smsData);

    this.logger.log('smsRequest', smsRequest);

    return smsRequest;
  };

  sendBulkSmsWithArrayPayload = async (
    data: Array<IBulkSmsPayload | IOneSmsPayload>,
  ) => {
    const smsData = [];
    let formattedPhoneNumbers;
    const smsFrom = process.env.SMS_FROM;

    try {
      data.forEach((payload) => {
        if (Array.isArray(payload.to) && payload.to.length > 0) {
          formattedPhoneNumbers = payload.to.map((phone) =>
            PhoneNumberUtil.validatePhoneNumber(phone),
          );
          smsData.push({
            to: formattedPhoneNumbers,
            message: payload.message,
            from: smsFrom,
          });
        } else {
          smsData.push({
            to: payload.to,
            message: payload.message,
            from: smsFrom,
          });
        }
      });

      this.logger.log('Bulk Sms With Array Payload', smsData);

      const smsRequest = await sms.send(smsData);

      this.logger.log('smsRequest', smsRequest);

      return smsRequest;
    } catch (error) {
      this.logger.log('sendBulkSmsWithArrapPayload \n', error);
    }
  };
}
