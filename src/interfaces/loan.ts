import { INetworkResponse } from './auth';
import { ICollateral } from './collateral';
import { IDocument } from './documents';

export interface ILoan {
  _id?: string;
  amount?: number;
  tenorType?: any;
  purpose?: string;
  approved?: string | boolean;
  employmentStatus?: any;
  tenor?: number;
  status?: number;
  loan_product?: { [key: string]: any };
  disbursed?: boolean;
  userId?: string;
  employmentDetailId?: string;
  updatedAt?: any;
  createdAt?: any;
  collateral?: ICollateral[];
  documents?: { [key: string]: any }[];
  approvedAt?: any;
  approvedBy?: any;
  channel?: any;
  collaterals?: any;
  comment?: any;
  createdBy?: any;
  dueDate?: any;
}

export enum LoanStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  PROCESSING = 'processing',
  DISBURSED = 'disbursed',
  REPAID = 'repaid',
}

export interface ILoanInfo {
  amount: number;
  duration: string;
  purpose?: string;
}

export interface ICreateLoan extends ILoan {
  state?: string;
  lga?: string;
  street?: string;
  referralCode?: string;
  profession?: string;
  organization?: string;
  rcNumber?: string;
  city?: string;
  otherIncome?: string;
  monthlyIncome?: string;
  maritalStatus?: string;
  collateral?: ICollateral[];
  draft?: boolean;
}

export interface ICreateLoanRequest {
  amount?: number;
  employmentStatus?: 'EMPLOYEE' | 'BUSINESS_OWNER';
  tenorType?: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  purpose?: string;
  organization?: string;
  tenor?: number;
  rcNumber?: string;
  lga?: string;
  state?: string;
  maritalStatus?: string;
  city?: string;
  profession?: string;
  street?: string;
  collateral?: any;
  otherIncome?: string;
  monthlyIncome?: string;
  referralCode?: string;
  promoted?: string;
  employmentId?: string;
}

export interface IUpdateLoanApplication extends ICreateLoanRequest {
  comment?: string;
}

export interface ILoanState {
  loans?: Array<ILoan>;
  createLoan?: ICreateLoan;
  requiredDocuments?: Array<IDocument>;
  collaterals?: Array<ICollateral>;
  selectedDocument?: IDocument;
  selectedParentDocument?: IDocument;
  uploadedDocuments?: any;
  salaryBands?: Array<ISalaryBand>;
  notifications?: Array<INotificationDetails>;
}

export interface ICreateLoanApplicationResponse extends INetworkResponse {
  data: ILoan;
}

export interface ILoanOffer {
  _id: string;
  requestedAmount: number;
  duration: string;
  interestRateBand: string;
  interestRate: number;
  status: number;
  contractAndAgreement: unknown;
  loanApplicationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface IGetLoanOfferResponse extends INetworkResponse {
  data: ILoanOffer;
}

export interface ILoanDetails {
  _id: string;
  amount: number;
  tenor: number;
  tenorType: string;
  purpose: string;
  employmentDetailId: string;
  employmentStatus: string;
  maritalStatus: string;
  loanProductId: string;
  interestBand: string;
  interest: number;
  comment: string;
  status: number;
  userId: string;
  guarantorId: string;
  mifosId: string;
  assetId: string;
  dueDate: string;
  approved: boolean;
  disbursed: boolean;
  approvedAt: string;
  approvedBy: string;
  loan_product: { [key: string]: any };
  loan_offer: { [key: string]: any };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user: { [key: string]: any };
  collaterals: ICollateral[];
  documents: IDocument[];
}

export interface IGetLoanDetailsResponse extends INetworkResponse {
  data: ILoanDetails;
}

export interface IGetLoanApplicationResponse extends INetworkResponse {
  data: ILoan;
}

export interface ILoanHistoryResponse extends INetworkResponse {
  data: Array<ILoan>;
}

export interface ISalaryBand {
  _id: string;
  low: number;
  high: number;
  desc: string;
}

export interface ISalaryBandResponse extends INetworkResponse {
  data: Array<ISalaryBand>;
}

export interface IEmloymentDetail {
  _id: string;
  cacDocumentURL: string;
  cacNumber: string;
  city: string;
  createdAt: string;
  createdBy: string;
  employerAddress: string;
  employerName: string;
  isActive: boolean;
  lga: string;
  monthlyIncome: string;
  otherIncome: number;
  profession: string;
  state: string;
}

export interface IActiveEmploymentDetailResponse extends INetworkResponse {
  data: IEmloymentDetail;
}

export interface INotificationReplies {
  message: string;
  attachments?: { name: string; url: string }[];
  createdAt: string;
  createdBy: string;
}

export interface INotificationReplyData {
  message: string;
  attachments?: { name: string; url: string }[];
}

export interface INotificationReplyResponse extends INetworkResponse {
  data: number[];
}

export interface INotificationDetails {
  _id: string;
  subject: string;
  message: string;
  replies: INotificationReplies[];
  loanApplicationId: string;
  userId: string;
  read: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sender?: string;
}

export interface IGetNotificationRepsonse extends INetworkResponse {
  data: INotificationDetails[];
}

export interface IInappNotificationData {
  _id: string;
  subject: string;
  message: string;
  read: number;
  userId: string;
  loanApplicationId: string;
  createdAt: string;
  updatedAt: string;
  sender?: string;
}

export interface IGetInappNotificationResponse extends INetworkResponse {
  data: Array<IInappNotificationData>;
}

export interface IGetInappNotificationByIdResponse extends INetworkResponse {
  data: IInappNotificationData;
}

export interface IGetNotificationByIdRepsonse extends INetworkResponse {
  data: INotificationDetails;
}

export interface ICombinedNotifications {
  _id: string;
  subject: string;
  message: string;
  read: number;
  userId: string;
  loanApplicationId: string;
  createdAt: string;
  updatedAt: string;
  replies?: INotificationReplies[];
  createdBy?: string;
  sender?: string;
}

export interface IUploadCommentAttachmentResponse extends INetworkResponse {
  data: {
    url: string;
  };
}
export interface IMifoRepaymentPeriod {
  fromDate?: Array<number>;
  dueDate: Array<number>;
  principalDisbursed: number;
  principalLoanBalanceOutstanding: number;
  feeChargesDue: number;
  feeChargesOutstanding: number;
  totalOriginalDueForPeriod: number;
  totalDueForPeriod: number;
  totalOutstandingForPeriod: number;
  totalActualCostOfLoanForPeriod: number;
  complete: boolean;
  daysInPeriod?: number;
  principalOriginalDue?: number;
  principalDue?: number;
  principalOutstanding?: number;
  interestOriginalDue?: number;
  interestDue?: number;
  interestOutstanding?: number;
  penaltyChargesDue?: number;
  totalPaidForPeriod?: number;
  totalInstallmentAmountForPeriod?: number;
  period: number;
}
export interface IRepaymentData {
  loanId: string;
}
export interface IGetRepaymentResponse extends INetworkResponse {
  data: {
    status: boolean;
    message: string;
    data: {
      status: string;
      code: string;
      data: {
        totalAmountDisbursed: number;
        totalInterestCharged: number;
        totalRepaymentExpected: number;
        totalOutstanding: number;
        totalPrincipalPaid: number;
        totalPrincipalOutstanding: number;
        totalInterestPaid: number;
        totalInterestOutstanding: number;
        feeChargesCharged: number;
        feeChargesPaid: number;
        feeChargesOutstanding: number;
        penaltyChargesCharged: number;
        penaltyChargesPaid: number;
        penaltyChargesOutstanding: number;
        repaymentSchedule: IMifoRepaymentPeriod[];
      };
    };
  };
}

export interface IRepayment {
  totalAmountDisbursed: number;
  totalInterestCharged: number;
  totalRepaymentExpected: number;
  totalOutstanding: number;
  totalPrincipalPaid: number;
  totalPrincipalOutstanding: number;
  totalInterestPaid: number;
  totalInterestOutstanding: number;
  feeChargesCharged: number;
  feeChargesPaid: number;
  feeChargesOutstanding: number;
  penaltyChargesCharged: number;
  penaltyChargesPaid: number;
  penaltyChargesOutstanding: number;
  repaymentSchedule: IMifoRepaymentPeriod[];
}

export interface ICheckLoanRepaymentData {
  loanApplicationId: string;
  startDate: string;
  endDate: string;
}

export interface ICheckLoanRepaymentResponse extends INetworkResponse {
  data: {
    status: boolean;
    message: string;
    data: {
      statuscode: string;
      authParams: [
        {
          description2: string;
          label1: string;
          param1: string;
          label2: string;
          description1: string;
          param2: string;
        }
      ];
      requestId: string;
      mandateId: string;
      remitaTransRef: string;
      status: string;
    };
  };
}

export interface IValidateRemitaData {
  remitaTransRef: string;
  otp: string;
  card: string;
}

export interface IValidateRemitaResponse extends INetworkResponse {
  data: {
    status: boolean;
    message: string;
    data: {
      statuscode: string;
      mandateId: string;
      status: string;
    };
  };
}

export interface IActivateMandateResponse extends INetworkResponse {
  data: Array<number>;
}

export interface ILoanDurationData {
  _id: string;
  tenor: number;
  tenorType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoanDurationResponse extends INetworkResponse {
  data: Array<ILoanDurationData>;
}

export interface IVBankAccountData {
  id: string;
  accountNo: number;
  accountType: string;
  accountBalance: number;
  productId: number;
  productName: string;
  status: string;
  currency: string;
  nickname: string;
  transactionEnabled: boolean;
}

export interface IVBankAccountResponse extends INetworkResponse {
  data: IVBankAccountData[];
}
