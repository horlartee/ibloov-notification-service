export default class UrlUtil {
  static generateAnonUserUrl(ssoId: string): string {
    return process.env.MERCHANT_DASHBOARD_BASE_URL.replace('{ssoId}', ssoId);
  }
}
