export const periodList = [
  '1 Month',
  '3 Months',
  '6 Months',
  '9 Months',
  '12 Months',
  '2 Years',
];

export const rawPeriodMap = {
  Month: 'MONTH',
  month: 'MONTH',
  Months: 'MONTH',
  Years: 'YEAR',
  Year: 'YEAR',
  year: 'YEAR',
  Week: 'WEEK',
  week: 'WEEK',
  Weeks: 'WEEK',
  Day: 'DAY',
  day: 'DAY',
  Days: 'DAY',
};

export const periodMap = {
  // DAILY: 'DAY',
  // WEEKLY: 'WEEK',
  MONTHLY: 'MONTH',
  // YEARLY: 'YEAR',
};

export const convertPeriod = (period: string) => {
  if (period) {
    let duration = period.trim().split(' ')[0];
    let tenor = period.trim().split(' ')[1];
    tenor = `${tenor[0].toUpperCase()}${tenor.substring(1).toLowerCase()}`;
    if (+duration > 1) {
      return `${duration} ${tenor}s`;
    }
    return `${duration} ${tenor}`;
  }
  return '';
};

export const MARITIAL_STATUS = [
  { val: 'SINGLE', desc: 'Single' },
  { val: 'MARRIED', desc: 'Married' },
  { val: 'WIDOWED', desc: 'Widowed' },
  { val: 'DIVORCED', desc: 'Divorced' },
];
export const PROPERTY_TYPES = [
  { val: 'VEHICLE', desc: 'Vehicle' },
  { val: 'PROPERTY', desc: 'Property' },
  // { val: 'OTHERS', desc: 'Others' },
];

export const COLLATERAL_TYPES = {
  EMPLOYEE: 'EMPLOYEE',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
};

export function arrayToDurationMap(tenor: string) {
  let array = new Array(0);
  array.push('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  array.forEach((item, index) => {
    let label = item;
    if (tenor) {
      label = item + ' ' + tenor;
      if (index > 0) {
        label = label + 's';
      }
    }
    array[index] = { value: item, label };
  });
  return array;
}

export const generalInfoLabelToTextMap = {
  amount: 'Amount',
};

export const banks = [
  { name: 'VFD', value: '999999' },
  { name: 'Zenith', value: '057' },
  { name: 'Access', value: '044' },
];

export const repaymentMethods = [
  { name: 'Bank', value: 'BANK' },
  { name: 'Card', value: 'CARD' },
];

export const remitaBanks = [
  { name: 'FCMB', code: '214' },
  { name: 'Zenith', code: '057' },
  { name: 'Fidelity', code: '070' },
  { name: 'Sterling', code: '232' },
  { name: 'Jaiz', code: '301' },
  { name: 'Wema', code: '035' },
  { name: 'Keystone', code: '082' },
  { name: 'Providus', code: '101' },
  { name: 'Heritage', code: '030' },
];
