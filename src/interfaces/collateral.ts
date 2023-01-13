import { INetworkResponse } from './auth';
import { IDocument } from './documents';

export interface ICollateral {
  _id: string;
  name: string;
  description: string;
  status: number;
  slug: string;
  createdAt: string;
  document_types: Array<IDocument>;
}

export interface ICollateralResp extends INetworkResponse {
  data: Array<ICollateral>;
}
