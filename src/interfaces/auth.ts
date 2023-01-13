export interface INetworkResponse {
  statusCode: number;
  status: number;
  message: string;
}

export interface IAuthState {
  vToken?: string;
  authorization?: string;
  profile?: any;
}

export interface IExchangeTokenResp extends INetworkResponse {
  data: {
    token: string;
    isAllowed?: boolean;
  };
}

export interface IGetUserData {
  _id: string;
  firstName: string;
  lastName: string;
  customerId: string;
  externalId: string;
  deviceId: string;
  phone: string;
  email: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role: {
    _id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IGetUserResponse extends INetworkResponse {
  data: IGetUserData;
}
