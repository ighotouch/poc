import Colors from 'common/Colors';
import {
  DetailedHTMLProps,
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import useToast from 'hooks/useToast';

export interface MyInputHandles {
  focusInput(): void;
  checkValidation(): number;
}

export interface ITextInput
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  placeholder?: string;
  value?: string;
  label?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textArea';
  format?: 'amount';
  style?: any;
  secure?: boolean;
  noDecimals?: boolean;
  countDown?: boolean;
  height?: number;
  indicator?: string;
  icon?: number;
  noCheck?: boolean;
  multiline?: boolean;
  editable?: boolean;
  maxLength?: number;
  errorIndicator?: string | null;
  loading?: boolean;
  topRightIndicator?: any;
  optional?: boolean;
  showStrength?: boolean;
  validationRules?: string;
  keyboardType?: any;
  step?: number;
  text?: string;
  leftIcon?: string;
  onChangeText?: (t: string) => void;
  currencyStyle?: any;
  innerContainerStyle?: any;
  textStyle?: any;
  returnKeyType?: string;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  noLabel?: boolean;
  confirmation?: string;
  gap?: number;
  validLength?: number;
}

// type Ref = RefObject<TextInput>
const TextInput: ForwardRefRenderFunction<MyInputHandles, ITextInput> = (
  {
    placeholder,
    value,
    format,
    label,
    style = {},
    secure = false,
    inputType = 'text',
    noCheck,
    validationRules,
    optional,
    loading,
    errorIndicator,
    onChangeText,
    confirmation,
    noDecimals,
    editable = true,
    topRightIndicator,
    textStyle,
    noLabel,
    validLength,
    maxLength,
  },
  ref
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [secureTextVisible, setSecureTextVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const Toast = useToast();

  useEffect(() => {
    if (onChangeText && value && !active) onChangeText(value);
    setActive(true);
    setErrorMessage('');
    setError(false);
  }, [value]);

  useEffect(() => {
    if (loaded) handleValidationCheck();
  }, [value, text, loaded, topRightIndicator, loading, handleValidationCheck]);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef?.current?.focus();
    },
    checkValidation: () => {
      let errorCount = validate();
      return errorCount;
    },
  }));

  function formatNumber(n: any) {
    if (n == null || n == undefined) {
      return '';
    }
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function amountFormatter(input_val: any) {
    if (input_val === undefined) {
      return;
    }

    const decimal_pos = input_val.indexOf('.');
    if (decimal_pos >= 0 && !noDecimals) {
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);
      left_side = formatNumber(left_side);
      right_side = formatNumber(right_side);
      right_side = right_side.substring(0, 2);
      input_val = left_side + '.' + right_side;
    } else {
      input_val = noDecimals
        ? formatNumber(input_val.replace(/\./g, ''))
        : formatNumber(input_val);
    }
    return input_val;
  }

  function handleOnChangeText(text: string) {
    let t = text;
    if (maxLength && text.length === maxLength + 1) return;
    if (format === 'amount') {
      t = amountFormatter(text);
    }
    setLoaded(true);
    if (onChangeText) onChangeText(t);
    setText(t);
  }

  function handleValidationCheck() {
    if (noCheck) {
      return;
    }
    setError(false);
    setErrorMessage('');
    // Validate
    validate();
  }

  function validate(): number {
    if (validationRules) {
      const rules = validationRules.split('|');
      const errors = rules.filter((type: string) => validationSwitch(type));
      // show error
      if (errors && errors.length > 0) {
        setError(true);
      }
      return errors.length;
    }

    const error = validationSwitch();
    if (error) {
      setError(true);
      return 1;
    }

    return 0;
  }

  function validationSwitch(type?: string) {
    if (value && value.length > 0) {
      if (topRightIndicator && topRightIndicator.error) {
        setError(true);
        setErrorMessage('Required');
        return true;
      }
      if (type?.trim() === 'number') {
        const number = /^(\s*-?\d+(\.\d+)?)(\s*,\s*-?\d+(\.\d+)?)*$/;
        if (!number.test(value || '') && value !== '') {
          setError(true);
          setErrorMessage('Not a valid number');
          return true;
        }
      }

      if (format === 'amount') {
        const amt = parseFloat(value || '');
        if (!(amt > 0)) {
          setError(true);
          setErrorMessage('Not a valid amount');
          return true;
        }
      }

      if (type?.trim().includes('length')) {
        const v = type?.trim().split(':');

        if (value.length < parseInt(v[1])) {
          setError(true);
          setErrorMessage(`At least ${v[1]} char`);
          return true;
        }
      }

      if (type?.trim() === 'confirm') {
        if (value !== confirmation && value !== '') {
          setError(true);
          setErrorMessage('Does not match');
          return true;
        }
      }

      if (type?.trim() === 'email') {
        const mail =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!mail.test(value)) {
          setError(true);
          setErrorMessage('Not a valid email');
          return true;
        }
      }

      if (type?.trim() === 'phone') {
        const numberPhone = /^(\s*-?\d+(\.\d+)?)(\s*,\s*-?\d+(\.\d+)?)*$/;
        if (
          (!numberPhone.test(value) && value !== '') ||
          (value.length < 11 && value.length > 15)
        ) {
          setError(true);
          setErrorMessage('Not a valid phone number');
          return true;
        }
      }

      if (type?.trim() === 'password') {
        let no = 0;
        if (value.length <= 5) {
          {
            setPasswordStrength(0);
            setErrorMessage('Should be greater than 5');
            return true;
          }
        }

        // If the password length is greater than 6 and contain any lowercase alphabet or any number or any special character
        if (
          value.length > 6 &&
          (value.match(/[a-z]/) ||
            value.match(/\d+/) ||
            value.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))
        ) {
          setPasswordStrength(1);
        }

        // If the password length is greater than 6 and contain alphabet,number,special character respectively
        if (
          value.length > 6 &&
          ((value.match(/[a-z]/) && value.match(/\d+/)) ||
            (value.match(/\d+/) && value.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) ||
            (value.match(/[a-z]/) && value.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)))
        ) {
          setPasswordStrength(2);
        }

        // If the password length is greater than 6 and must contain alphabets,numbers and special characters
        if (
          value.length > 6 &&
          value.match(/[a-z]/) &&
          value.match(/\d+/) &&
          value.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)
        ) {
          setPasswordStrength(3);
        }

        // return true;
      }
    }

    if (type?.trim() === 'required') {
      if (!value) {
        setError(true);
        setErrorMessage('Required');
        return true;
      }
    }

    if (loading) {
      setError(true);
      setErrorMessage('Loading');
      return true;
    }

    return false;
  }

  function onBlur() {
    if (value) {
    }
  }

  function focusInput() {
    inputRef?.current?.focus();
  }

  function renderTopRightIndicator() {
    if (
      topRightIndicator &&
      value &&
      ((validLength && value.length === validLength) ||
        (!validLength && value.length > 1))
    ) {
      return (
        <div
          className="d-flex align-items-center"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              marginLeft: 8,
              fontSize: 11,
              color: topRightIndicator.color,
            }}
          >
            {topRightIndicator?.label}
          </div>
        </div>
      );
    }

    if (errorIndicator && !secure) {
      return (
        <div className="d-flex align-items-center" style={{ flexDirection: 'row' }}>
          <div style={{}}>{errorIndicator}</div>
        </div>
      );
    }
    if (error && !secure) {
      return (
        <div className="d-flex align-items-center" style={{ flexDirection: 'row' }}>
          <div
            style={{
              marginLeft: 8,
              fontFamily: 'Avert',
              fontSize: 11,
            }}
          >
            {errorMessage}
          </div>
        </div>
      );
    }
  }

  return (
    <div onClick={focusInput}>
      <div style={style}>
        {!noLabel && (
          <div
            className="d-flex flex-row justify-content-between align-content-center"
            style={{
              marginBottom: 8,
            }}
          >
            <div style={{ flexDirection: 'row' }}>
              <div style={{ fontSize: 14, color: '#4B4B4B' }}>{label}</div>
              {!!optional && <div style={{ marginLeft: 4 }}>(Optional)</div>}
            </div>

            {/* {renderTopRightIndicator()} */}
          </div>
        )}
        <div
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {inputType === 'textArea' ? (
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                onChange={(e) => handleOnChangeText(e.currentTarget.value)}
                style={{
                  borderColor: error ? Colors.red : Colors.inputBorder,
                  borderWidth: 1,
                  padding: 16,
                  alignItems: 'center',
                  display: 'flex',
                  flex: 1,
                  fontSize: 14,
                  borderRadius: 10,
                  backgroundColor: editable ? '#F2F6F9' : 'black',
                  color: Colors.darkText,
                  width: '100%',

                  ...(textStyle ? textStyle : {}),
                }}
                value={value}
                // style="height: 100px"
              ></textarea>
              {/* <label htmlFor="floatingTextarea2">Comments</label> */}
            </div>
          ) : (
            <div>
              <input
                className="form-control"
                ref={inputRef}
                placeholder={placeholder}
                autoCapitalize="none"
                onBlur={onBlur}
                style={{
                  borderColor: error ? Colors.red : Colors.inputBorder,
                  borderWidth: 1,
                  padding: 16,
                  alignItems: 'center',
                  display: 'flex',
                  flex: 1,
                  fontSize: 14,
                  borderRadius: 10,
                  backgroundColor: '#F2F6F9',
                  color: Colors.darkText,
                  width: '100%',

                  ...(textStyle ? textStyle : {}),
                }}
                disabled={editable === false ? true : false}
                type={inputType}
                spellCheck={false}
                onChange={(e) => handleOnChangeText(e.currentTarget.value)}
                // textAlignVertical="top"
                value={value}
              />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default forwardRef(TextInput);
