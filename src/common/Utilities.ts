import { MyInputHandles } from 'components/Input';
import { IDocument } from 'interfaces/documents';
import * as LoanStatus from './constants/loanStatus';

export const amountFormatter = (text: string) => {
  if (text === undefined) {
    return;
  }

  return text;
};

export const formatMoney = (
  number: any,
  currency = 'NGN',
  decimals = 2,
  dec_point = '.',
  thousands_sep: string = ','
) => {
  if (number === null) {
    return currencies[currency] || currency;
  }
  const value = parseInt(number);
  if (isNaN(value)) {
    return '';
  }
  //return new Intl.NumberFormat('en-US', {style: 'currency', currency: cur}).format(value).replace('NGN', '₦');
  var exponent = '',
    numberstr = number.toString(),
    eindex = numberstr.indexOf('e'),
    temp,
    sign,
    integer,
    fractional,
    i,
    z;
  if (eindex > -1) {
    exponent = numberstr.substring(eindex);
    number = parseFloat(numberstr.substring(0, eindex));
  }
  temp = Math.pow(10, decimals);
  number = Math.round(number * temp) / temp;
  sign = number < 0 ? '-' : '';
  integer = (number > 0 ? Math.floor(number) : Math.abs(Math.ceil(number))).toString();
  fractional = number.toString().substring(integer.length + sign.length);
  fractional =
    decimals > 0 || fractional.length > 1 ? dec_point + fractional.substring(1) : '';
  if (decimals > 0) {
    for (i = fractional.length - 1, z = decimals; i < z; ++i) {
      fractional += '0';
    }
  }
  // @ts-ignore
  thousands_sep =
    thousands_sep !== dec_point || fractional.length === 0 ? thousands_sep : null;
  if (thousands_sep !== '') {
    for (i = integer.length - 3; i > 0; i -= 3) {
      integer = integer.substring(0, i) + thousands_sep + integer.substring(i);
    }
  }

  return (
    (currency === 'disable' ? '' : (currencies[currency] || currency) + ' ') +
    sign +
    integer +
    fractional +
    exponent
  );
};

const currencies: any = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
  JPY: '¥',
  CAD: '$',
  ZAR: 'R',
  SGD: '$',
  AUD: '$',
  N: 'N',
};

export const checkInputValidation = (refs: Array<MyInputHandles>) => {
  let errorCounter = 0;
  for (let i = 0; i < refs.length; i++) {
    const element = refs[i];
    if (element) {
      if (element.checkValidation() !== 0) {
        errorCounter++;
      }
    }
  }

  return errorCounter === 0 ? true : false;
};

export const checkBiometry = ({
  password,
  biometryType,
  biometry,
}: {
  password: string;
  biometryType: string;
  biometry: string;
}) => {
  if (password) {
    return 'Sign In';
  } else if (biometry && biometryType) {
    return 'Sign in with ' + biometryType;
  }
};

export const fillDropDown = (value: string, mapped?: { desc: string; val: string }) => {
  let val = 'value';
  let description = 'label';
  if (!value) return {};
  if (mapped) {
    val = mapped.val;
    description = mapped.desc;
  }
  return {
    [val]: value,
    [description]: value.charAt(0).toUpperCase() + value.slice(1),
  };
};

export const cleanText = (text: string) => {
  if (text) {
    text = text[0].toUpperCase() + text.slice(1).toLowerCase();
    text = text.trim().replace('_', ' ');
    return text;
  }
  return '-';
};

export const getLoanStatus = (status: number) => {
  const ls: { [key: string]: number } = LoanStatus;
  const lsKeys = Object.keys(ls);
  for (const s of lsKeys) {
    if (ls[s] === status) {
      return cleanText(s);
    }
  }
};

export const getLoanApplicationCollateralNames = (data: { [key: string]: any }[]) => {
  if (data?.length) {
    let names: string[] = [];
    for (const coll of data) {
      names.push(cleanText(coll.name));
    }
    return names.toString().replace(/,/g, ', ');
  } else {
    return '-';
  }
};

export const removeDuplicateObject = (data: IDocument[]) => {
  return [...Array.from(new Map(data.map((d) => [d._id, d])).values())];
};

export const testMail = (value: string) => {
  const mail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return mail.test(value);
};
