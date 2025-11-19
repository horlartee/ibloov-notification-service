import { Inject, Logger } from '@nestjs/common';
import { AppContainer } from 'src/enums/app.container.enum';
import IWhatsappProvider from 'src/interfaces/whatsapp/IWhatsappProvider.interface';
import { WhatsappPayload } from 'src/interfaces/whatsapp/whatsappPayload';

export class WhatsappCoreService implements IWhatsappProvider {
  private readonly logger = new Logger(WhatsappCoreService.name);
  constructor(
    @Inject(AppContainer.WHATSAPP_PROVIDER)
    private readonly whatsappProvider: IWhatsappProvider,
  ) {}
  async sendWhatsapp(data: WhatsappPayload) {
    try {
      const response = await this.whatsappProvider.sendWhatsapp(data);
      return response;
    } catch (error) {
      this.logger.log('twillio :: sendWhasapp error \n', error);
    }
  }
}
