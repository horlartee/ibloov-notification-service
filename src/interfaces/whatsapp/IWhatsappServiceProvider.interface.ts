export default interface IWhatsappServiceProvider {
  sendWhatsapp(phone_number: string, message: string, from?: string);

  phoneVerificationCode(phone_number: string, code: string);

  debtReminder(phone_number: string, debtInfo?: Record<string, unknown>);
}
