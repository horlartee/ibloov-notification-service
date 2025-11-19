import { WhatsappPayload } from './whatsappPayload';

export default interface IWhatsappProvider {
  /**
   *
   * @param to
   * @param body
   * @param from
   * @param contentVariables
   */
  sendWhatsapp(data: WhatsappPayload): any;
}
