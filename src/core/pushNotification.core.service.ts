import { Inject, Logger } from '@nestjs/common';
import { AppContainer } from 'src/enums/app.container.enum';
import IPushProvider from 'src/interfaces/push/IPushProvider.interface';
import { IOneSignalPush } from 'src/interfaces/push/onesignal/onesignal.interface';

export class PushCoreService {
  private readonly logger = new Logger(PushCoreService.name);
  constructor(
    @Inject(AppContainer.PUSH_NOTIFICATION)
    private readonly pushNotificationProvider: IPushProvider,
  ) {}

  async createPushNotification(payload: IOneSignalPush) {
    try {
      if (payload?.include_player_ids?.length < 1) return;

      return this.pushNotificationProvider.createNotification(payload);
    } catch (error) {
      this.logger.error(
        'PushCoreService :: createPushNotification \n',
        error.message || error,
      );
      return false;
    }
  }
}
