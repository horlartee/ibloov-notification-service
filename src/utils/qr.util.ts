import * as QRCode from 'qrcode';

export default class QrUtil {
  static async generateQrCode(link: string): Promise<string> {
    return await QRCode.toDataURL(link, {
      type: 'image/png',
    });
  }
}
