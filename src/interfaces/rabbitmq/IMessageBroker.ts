export interface IMessageBroker {
  produce?: (payload: any, routing_key: RoutingKeys) => Promise<boolean>;

  consume(): void;
}

export enum RoutingKeys {
  NOTIFICATION_SERVICE = 'service.hoshistech-notification',
  PAYMENT_SERVICE = 'service.hoshistech-payment',
  IBLOOV_AUTH = 'service.ibloov-auth',
  IBLOOV_TRANSACTION_SERVICE = 'service.ibloov-transaction-service',
}
