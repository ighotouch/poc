import { MyInputHandles } from 'components/Input';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

export interface IRadio {
  data?: Array<any>;
  label?: string;
  labelClassName?: string;
  map: { val: string; desc: string };
  onChange?: (text: string) => void;
  fill?: any;
  value?: string;
  validationRules?: string;
  display?: 'row' | 'column';
  spacing?: string;
}
const Radio: ForwardRefRenderFunction<MyInputHandles, IRadio> = (
  {
    data,
    label,
    map,
    onChange,
    fill,
    value,
    validationRules,
    display = 'row',
    spacing,
    labelClassName,
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
  }, [data]);

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

  function handleOnRadioChange(e) {
    // TODO: is there a reason for this?
    // e.preventDefault();
    const v = e.currentTarget.value;
    setError(false);
    setSelectedValue(v);
    setLoaded(true);
    if (onChange) onChange(v);
  }
  return (
    <div>
      <div
        className="d-flex flex-row justify-content-between align-content-center"
        style={{
          marginBottom: 8,
        }}
      >
        <div style={{ flexDirection: 'row' }}>
          <div style={{}} className={labelClassName}>
            {label}
          </div>
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

      <div className={`d-flex flex-${display} justify-content-between`}>
        {!!data &&
          data.map((d, i) => {
            return (
              <div className={`form-check flex-grow-1 ${spacing}`}>
                <input
                  className="form-check-input"
                  checked={selectedValue === d.val ? true : false}
                  type="radio"
                  name="flexRadioDefault"
                  id={`flexRadioDefault${i + 1}`}
                  onChange={handleOnRadioChange}
                  value={d[map.val]}
                />
                <label className="form-check-label" htmlFor={`flexRadioDefault${i + 1}`}>
                  {d[map.desc]}
                </label>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default forwardRef(Radio);
