import { INetworkResponse } from './auth';

export interface ICreateBankData {
  bankId: string;
  accountNumber: string;
  bankName: string;
  loanApplicationId: string;
}

export interface IBankResponseData {
  _id: string;
  bankCode: string;
  accountNumber: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
}

export interface ICreateBankResponse extends INetworkResponse {
  data: IBankResponseData;
}
export interface IBankListData {
  _id: string;
  id: string;
  nip_code: string;
  cbn_code: string;
  bank_name: string;
  bank_logo: string;
  createdAt: string;
  updatedAt: string;
}
export interface IBankListResponse extends INetworkResponse {
  data: Array<IBankListData>;
}

export interface IBankDetailsResponseData {
  nuban?: string;
  bankName?: string;
  bankId?: string;
}

export interface IBankDetailsResponse extends INetworkResponse {
  data: IBankDetailsResponseData[];
}

export interface IOkraBanks {
  id: string;
  name: string;
  slug: string;
  icon: string;
  v2_icon: string;
  v2_logo: string;
  products: Array<string>;
  colors: {
    primary: string;
    accent: string;
    bg: string;
    button: string;
    icon: string;
  };
  secret_question_or_otp: boolean;
  secret_question_or_otp_mobile: boolean;
  secret_question_or_otp_corp: boolean;
  payments: {
    ind: {
      exists: boolean;
      recurring: boolean;
      save_bene: boolean;
    };
    corp: {
      exists: boolean;
      recurring: boolean;
      save_bene: boolean;
    };
    mobile: {
      exists: boolean;
      sso: boolean;
      recurring: boolean;
      save_bene: boolean;
    };
    ussd: {
      exists: boolean;
      recurring: boolean;
      save_bene: boolean;
    };
    secret: boolean;
  };
  ussd: boolean;
  countries: Array<string>;
  corporate: boolean;
  status: string;
  individual: boolean;
  sortcode: string;
  alt_sortcode: null;
  created_at: string;
  last_updated: string;
}

export interface IOkraBanksResponseData {
  banks: Array<IOkraBanks>;
  credentials: null;
}

export interface IOkraBanksResponse extends INetworkResponse {
  data: {
    status: string;
    message: string;
    data: {
      status: string;
      message: string;
      data: IOkraBanksResponseData;
    };
  };
}
