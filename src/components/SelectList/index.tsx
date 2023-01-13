import Colors from 'common/Colors';
import {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { MyInputHandles } from '../Input';

export interface ISelectList {
  data?: Array<any>;
  label?: string;
  map: { val: string; desc: string };
  onChange?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  loading?: boolean;
  noLabel?: boolean;
  validationRules?: string;
  value?: string;
  initialSelectedIndex?: number;
  fill?: any;
}

const SelectList: ForwardRefRenderFunction<MyInputHandles, ISelectList> = (
  {
    data,
    map,
    placeholder,
    onChange,
    editable = true,
    noLabel,
    label,
    validationRules,
    value,
    fill,
  },
  ref
) => {
  const [error, setError] = useState(false);
  const [loading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    let timer: any;
    if (data) {
      if (fill && fill[map?.val] && [map?.desc]) {
        setSelectedValue(fill[map?.val]);
        timer = setTimeout(() => {
          if (onChange) onChange(fill[map?.val]);
        }, 200);
      }
    }
    return clearTimeout(timer);
  }, [data, fill?.val]);

  useEffect(() => {
    let timer: any;
    if (loaded) {
      validate();
    }
    return clearTimeout(timer);
  }, [value, loaded]);
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      // inputRef?.current?.focus();
    },
    checkValidation: () => {
      let errorCount = validate();
      return errorCount;
    },
  }));

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
    if (type?.trim() === 'required') {
      if (!value || value === placeholder || value === 'Select') {
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

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    event.preventDefault();
    const value = event.target.value;
    if (value && value !== placeholder && value !== 'Select') {
      setError(false);
    }
    setSelectedValue(value);
    if (onChange) onChange(value);
    setLoaded(true);
  }
  return (
    <div style={{ width: '100%' }}>
      {!noLabel && (
        <div
          className="d-flex flex-row justify-content-between align-content-center"
          style={{
            marginBottom: 8,
          }}
        >
          <div style={{ flexDirection: 'row' }}>
            <div style={{}}>{label}</div>
          </div>
          {error ? (
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
          ) : null}
        </div>
      )}
      <select
        className="form-select"
        aria-label="Default select example"
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
        }}
        onChange={handleChange}
      >
        <option selected>{placeholder ? placeholder : 'Select'}</option>
        {data?.map((d, i) => (
          <option value={d[map.val]} selected={d[map?.val] === selectedValue}>
            {d[map.desc]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default forwardRef(SelectList);
