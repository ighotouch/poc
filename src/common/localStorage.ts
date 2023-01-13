import { ICreateLoan } from 'interfaces/loan';

const LOAN_APPLICATION = 'LOAN_APPLICATION';
export const setStorage = ({ key, value }: { key: string; value: string }) =>
  localStorage.setItem(key, value);

export function getLoanApplicationFromStore(value: ICreateLoan) {
  localStorage.setItem(LOAN_APPLICATION, JSON.stringify(value));
}

export function storeLoanApplication(value: ICreateLoan) {
  localStorage.setItem(LOAN_APPLICATION, JSON.stringify(value));
}

export function clearLoanApplication() {
  localStorage.removeItem(LOAN_APPLICATION);
}

export async function getLoanApplication() {
  try {
    const i = await localStorage.getItem(LOAN_APPLICATION);
    if (i) return JSON.parse(i);
  } catch (error) {
    return {};
  }
}

export function saveLoanApplication(docs: any) {
  localStorage.setItem('savedApplication', 'true');
  if (docs) localStorage.setItem('uploadedDocuments', JSON.stringify(docs));
}

export function removeSavedLoanApplication() {
  localStorage.removeItem('savedApplication');
  localStorage.removeItem('uploadedDocuments');
}

export function getSavedLoanApplication(): string | null | {} {
  let savedApplication = localStorage.getItem('savedApplication');
  let savedUploadedDocument = localStorage.getItem('uploadedDocuments');
  if (savedApplication) {
    if (savedUploadedDocument) {
      savedUploadedDocument = JSON.parse(savedUploadedDocument);
      return savedUploadedDocument;
    }
    return {};
  }
  return null;
}
