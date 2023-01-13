import { INetworkResponse } from './auth';

export interface IInitiateCardResponse extends INetworkResponse {
  data: string;
}

export interface IInitiateCardData {
  redirect_url: string;
}

export interface IVerifyCardData {
  reference: string;
}

export interface ICardData {
  _id: string;
  cardNo: string;
  userId: string;
  txRef: string;
  flwRef: string;
  amount: number;
  currency: string;
  chargedAmount: number;
  appFee: number;
  merchantFee: number;
  processorResponse: string;
  authModel: string;
  narration: string;
  paymentType: string;
  accountId: string;
  amountSettled: number;
  status: string;
  expireMonth: any;
  expireYear: any;
  expiry: string;
  cardBin: string;
  last4digits: string;
  first4digits: string;
  type: string;
  token: string;
  email: string;
  cardName: string;
  phone: string;
  issuer: string;
  country: string;
  customerId: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVerifyCardResponse extends INetworkResponse {
  data: ICardData;
}

export interface IGetUserCardResponse extends INetworkResponse {
  data: ICardData;
}
