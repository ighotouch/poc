import { INetworkResponse } from './auth';

export interface IAssetRequest {
  type: string;
  colour: string;
  registrationNo: string;
  year: string;
  model: string;
  location?: string;
  titleHolder: string;
  customDocument?: string;
  loanApplicationId?: string;
}

export interface IAssetRes {
  _id: string;
  type: string;
  colour: string;
  registrationNo: string;
  year: string;
  model: string;
  location?: string;
  titleHolder: string;
  customDocument?: string;
  loanApplicationId?: string;
}

export interface IUpdateAssetRequest {
  type?: string;
  colour?: string;
  registrationNo?: string;
  year?: string;
  model?: string;
  location?: string;
  titleHolder?: string;
  customDocument?: string;
  loanApplicationId?: string;
}

export interface IAssetResp extends INetworkResponse {
  data: IAssetRes;
}
