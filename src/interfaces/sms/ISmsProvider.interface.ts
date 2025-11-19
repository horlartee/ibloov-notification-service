import { IBulkSmsPayload, IOneSmsPayload } from './interface/smsPayload';

export default interface ISmsProvider {
  sendSms?: (
    to: string,
    body: string,
    from?: string,
    meta?: Map<string, any>,
  ) => any;

  /**
   * Send one sms to one user
   */
  sendOneSms?: (data: IOneSmsPayload) => any;

  /**
   * Send multiple sms to multiple users
   */

  sendBulkSms?: (data: IBulkSmsPayload) => any;

  /**
   * Send multiple sms with dynamic content to multiple users
   */
  sendBulkSmsWithArrayPayload?: (
    data: Array<IBulkSmsPayload | IOneSmsPayload>,
  ) => any;
}
