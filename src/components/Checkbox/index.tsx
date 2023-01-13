import { MyInputHandles } from "components/Input";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface ICheckbox {
  label?: string;
  onChange?: (value: boolean) => void;
  checked?: boolean;
  validationRules?: string;
  name: string
}
const Checkbox: ForwardRefRenderFunction<MyInputHandles, ICheckbox> = (
  { label, onChange, checked = false, validationRules, name },
  ref
) => {
  const [error, setError] = useState(false);
  const [loading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(checked);


  useEffect(() => {
    let timer: any;
    if (loaded) {
      validate();
    }
    return clearTimeout(timer);
  }, [checked, loaded]);

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

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
      const rules = validationRules.split("|");
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
    if (type?.trim() === "required") {
      if (!checked) {
        setError(true);
        setErrorMessage("Required");
        return true;
      }
    }

    if (loading) {
      setError(true);
      setErrorMessage("Loading");
      return true;
    }

    return false;
  }

  function handleOnCheck(e) {
    const value = e.target.checked;
    setError(false);
    setIsChecked(value);
    setLoaded(true);
    if (onChange) onChange(value);
  }
  return (
    <div>
      <div
        className="d-flex flex-row justify-content-between align-content-center"
        style={{
          marginBottom: 8,
        }}
      >
        {error ? (
          <div
            className="d-flex align-items-center"
            style={{ flexDirection: "row" }}
          >
            <div
              style={{
                marginLeft: 8,
                fontFamily: "Avert",
                fontSize: 11,
              }}
            >
              {errorMessage}
            </div>
          </div>
        ) : null}
      </div>

      <div className="d-flex flex-row justify-content-between">
        <div className="form-check flex-grow-1">
          <input
            className="form-check-input filled-in"
            type="checkbox"
            name={name}
            id={name}
            onChange={handleOnCheck}
            checked={isChecked}
          />
          <label className="form-check-label" htmlFor={name}>
            {label}
          </label>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Checkbox);
