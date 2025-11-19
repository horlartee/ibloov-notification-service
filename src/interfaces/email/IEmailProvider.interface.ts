import { MailOptions } from '../common.interface';

interface IEmailProvider {
  /**
   *
   * @param to
   * @param templateId
   * @param templateData
   */
  sendMail(to: string, templateId: string, templateData?: any): any;

  /**
   * overload for when using providers that do not use templates
   * @param to
   * @param subject
   * @param message
   * @param from - optional
   */
  sendMail(
    to: string,
    subject: string,
    message?: Text | string,
    options?: MailOptions,
    attachments?: any | any[],
  ): any;

  /**
   * overload for when using providers that do not use templates
   * @param to
   * @param subject
   * @param message
   */
  //sendMail(to: string | string, subject: string | string, message?: Text | string, cc?: string | ): any

  /**
   * Send multiple email to multiple users
   * @param to
   * @param subject
   * @param message
   */
  sendMultiple(
    to: any,
    templateId: string,
    templateData?: any,
    options?: MailOptions,
    attachments?: any[],
  ): any;

  /**
   * NB: This is intended to be an improvement to the sendMultiple mail function.
   * Expected bosy should be an array.
   * @param payload;
   */
  sendMultipleWithArray(
    payload: Array<{
      from: string;
      to: any;
      templateId: string;
      templateData?: Record<string, any>;
      attachments?: any[];
    }>,
  ): Promise<void> | void;
}

export default IEmailProvider;
