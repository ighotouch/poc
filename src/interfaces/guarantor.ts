import { INetworkResponse } from './auth';

export interface IGuarantor {
  createdAt: string;
  updatedAt: string;
  _id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  lga: string;
  phone: string;
  address: string;
  email: string;
  userId: string;
  chequeNumber?: string;
  bvn?: string;
}

export interface IGuarantorRequest {
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  lga: string;
  city: string;
  email: string;
  address: string;
  chequeNumber?: string;
  bvn?: string;
  loanApplicationId?: string;
}

export interface IUpdateGuarantorRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  state?: string;
  lga?: string;
  city?: string;
  email?: string;
  address?: string;
  chequeNumber?: string;
  bvn?: string;
  loanApplicationId?: string;
}

export interface IGuarantorResp extends INetworkResponse {
  data: IGuarantor;
}
