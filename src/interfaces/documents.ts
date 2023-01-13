import { INetworkResponse } from './auth';

export interface IDocument {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  slug?: string;
  icon?: string;
  labels?: string;
  systemKey?: string;
  isMultiple?: boolean;
  isRequired?: boolean;
  isLocked?: boolean;
  maxAllowed?: any;
  status?: number;
  document_types: Array<IDocument>;
  childrenCount?: number;
  isVerificationRequired?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IChildDocumentResponse extends INetworkResponse {
  data: { data: IDocument[] };
}

export interface ICollateralDocument {
  collateralId: string;
  createdAt: string;
  documentTypeId: string;
  document_type: IDocument;
  updatedAt: string;
  _id: string;
}

export interface ICollateralDocumentResp extends INetworkResponse {
  data: Array<ICollateralDocument>;
}

export interface IUploadMeta {
  url: string;
  name: string;
  documentId: string;
  key: string;
  slug?: string;
  progress: number;
  status?: number;
}

export interface IUploadedDocuments {
  [key: string]: Array<IUploadMeta>;
}
