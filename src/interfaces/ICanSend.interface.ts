export default interface ICanSend {
  getSmsServiceProvider();

  getEmailServiceProvider();

  getWhatsappServiceProvider();

  getPushServiceProvider();
}
