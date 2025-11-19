export interface IQueueNotificationsPayload {
  event: string;
  buyerPayload?: {
    buyer_name: string;
    buyer_playerId: string;
    buyer_email: string;
    buyer_phone: string;
    buyer_ssoId: string;
  };
  merchantPayload?: {
    merchant_name: string;
    merchant_playerId: string;
    merchant_email: string;
    merchant_phone: string;
    merchant_ssoId: string;
  };
  currency: string;
  client_reference?: string;
  amount: number;
}
