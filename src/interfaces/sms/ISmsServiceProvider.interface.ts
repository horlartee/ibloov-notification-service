export default interface ISmsServiceProvider {

    sendSms(phone_number: string, code: string);

    phoneVerificationCode( phone_number: string, code: string );

    welcomeSmsToUser(user_phone_number: string, first_name: string)

}
