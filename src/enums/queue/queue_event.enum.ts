export enum QUEUE_EVENT {
  CREATE_WALLET = 'create_wallet',

  DEBIT_WALLET_CONFIRMATION_STATUS = 'debit_wallet_confirmation_status',
  CREDIT_WALLET_CONFIRMATION_STATUS = 'credit_wallet_confirmation_status',

  DEBIT_WALLET_EVENT = 'service.wallet-debit',
  CREDIT_WALLET_EVENT = 'service.wallet-credit',
}

export enum EXCHANGE {
  HOSHISTECH_EXCHANGE = 'hoshistech-exchange',
}
