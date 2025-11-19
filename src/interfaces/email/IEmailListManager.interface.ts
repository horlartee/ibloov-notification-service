import MailContact from '../contact';

export default interface IEmailListManager {
  createMailingList(payload: { name: string }): any;

  addToMailingList(data: Array<MailContact>): any;
}
