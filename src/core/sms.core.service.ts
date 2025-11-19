import { Inject, Logger } from '@nestjs/common';
import { AppContainer } from 'src/enums/app.container.enum';
import {
  IBulkSmsPayload,
  IOneSmsPayload,
} from 'src/interfaces/sms/interface/smsPayload';
import ISmsProvider from 'src/interfaces/sms/ISmsProvider.interface';

export class SmsCoreService {
  private readonly logger = new Logger(SmsCoreService.name);
  constructor(
    @Inject(AppContainer.SMS_PROVIDER)
    private readonly smsProvider: ISmsProvider,
  ) {}

  async sendOneSms(payload: IOneSmsPayload) {
    try {
      return await this.smsProvider.sendOneSms(payload);
    } catch (error) {
      this.logger.error(
        'SmsCoreService :: sendOneSms \n',
        error.message || error,
      );
      return false;
    }
  }

  async sendBulkSms(payload: IBulkSmsPayload) {
    try {
      return await this.smsProvider.sendBulkSms(payload);
    } catch (error) {
      this.logger.error('sendBulkSms :: sendOneSms \n', error.message || error);
      return false;
    }
  }

  async sendSmsWithArrayPayload(
    payload: Array<IBulkSmsPayload | IOneSmsPayload>,
  ) {
    try {
      return await this.smsProvider.sendBulkSmsWithArrayPayload(payload);
    } catch (error) {
      this.logger.error(
        'sendSmsWithArrayPayload :: sendOneSms \n',
        error.message || error,
      );
      return false;
    }
  }
}
