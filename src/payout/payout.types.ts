import { Payment } from '../payment/entities/payment.entity';

export interface Payout {
  id: number;
  payout: number;
}

export interface ProcessPayoutResponse {
  totalPayout: number;
  listPayments: Payout[];
}

export interface PaymentDetails {
  payment: Payment;
  netPayout: number;
  available: number;
}
