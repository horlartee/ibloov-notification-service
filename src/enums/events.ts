export enum IbloovEvent {
  BULK_EMAIL = 'bulk_email',
  BULK_EMAIL_WITH_ARRAY = 'bulk_email_with_array',
  SINGLE_MAIL = 'single_mail',
  EVENT_LIKED = 'event_liked',
  USER_CREATED = 'user_created',
  EVENT_CREATED = 'event_created',
  EVENT_FOLLOWED = 'event_followed',
  RESET_PASSWORD = 'reset_password',
  EVENT_FAVORITED = 'event_favorited',
  EVENT_PAID_FAILED = 'event_paid_failed',
  ATTENDEE_REGISTERED = 'attendee_registered',
  EVENT_PAID_SUCCESSFUL = 'event_paid_successful',
  AUTOMATED_WHATSAPP_MESSAGE = 'automated_whatsapp_message',

  //wallet
  DEBIT_WALLET = 'debit_wallet',
  CREDIT_WALLET = 'credit_wallet',
  WALLET_EXCHANGE = 'wallet_exchange',
  ANONYMOUS_USER_WALLET_CREDIT_NOTIFICATION = 'anonymous_user_wallet_credit',

  //virtual accounts
  VIRTUAL_ACCOUNT_CREATED_NOTIFICATION = 'virtual_account_created_notification',

  //generics
  SEND_PUSH_NOTIFICATION = 'send_push_notification',
  CREATE_MAILING_LIST = 'create_mailing_list',
  ADD_TO_MAILING_LIST = 'add_to_mailing_list',

  //sms
  SEND_ONE_SMS = 'send_one_sms',
  SEND_BULK_SMS = 'send_bulk_sms',
  SEND_BULK_SMS_WITH_ARRAY = 'send_bulk_sms_with_array',
}
