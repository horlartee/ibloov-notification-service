import { Injectable, Logger } from '@nestjs/common';
import * as OneSignal from 'onesignal-node';
import IPushProvider from 'src/interfaces/push/IPushProvider.interface';
import { IOneSignalPush } from 'src/interfaces/push/onesignal/onesignal.interface';

@Injectable()
export default class OneSignalProvider implements IPushProvider {
  private client: any;
  private readonly logger = new Logger(OneSignalProvider.name);

  constructor() {
    this.client = new OneSignal.Client(
      process.env.ONE_SIGNAL_APP_ID,
      process.env.ONE_SIGNAL_API_KEY,
    );
  }

  /**
   *
   * @param notification
   */
  createNotification = (payload: IOneSignalPush) => {
    try {
      payload.app_id = process.env.ONE_SIGNAL_APP_ID;

      this.logger.log('createNotification payload', payload);

      this.client
        .createNotification(payload)
        .then((data) => this.logger.log('onesignal resp', data?.body?.errors))
        .catch((err) => this.logger.log(err));
    } catch (error) {
      Logger.error(error);
    }
  };

  /**
   *
   * @param notificationId
   */
  cancelNotification = async (notificationId) => {
    try {
      await this.client.cancelNotification(notificationId);
    } catch (error) {
      Logger.error(error);
    }
  };
}
