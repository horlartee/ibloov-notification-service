import { MailOptions } from '../common.interface';

export default interface IEmailServiceProvider {
  sendMail(
    to: string,
    subjectOrTemplateId: string,
    templateDataOrHtml?: any,
    options?: MailOptions,
  );
}
