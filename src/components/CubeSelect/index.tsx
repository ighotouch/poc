import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Button from '@material-ui/core/Button';
import './styles.scss';
import PeriodSelect from 'components/PeriodSelect';

export interface ICubeItem {
  val: string;
  desc: string;
  actionComponent?: any;
}

export interface ICubeSelect {
  data: Array<ICubeItem>;
  map: { desc: string; val: string };
  onChange: (item: any) => void;
  label: string;
  value?: string;
  type?: 'period' | 'input';
  validationRules?: string;
  desc?: string;
  hideCustomButton?: any;
  fill?: any;
  orientation?: 'horizontal' | 'vertical';
}

export interface ICubeSelectRef {
  focusInput(): void;
  checkValidation(): number;
  onSubmit(item: ICubeItem, index: number): void;
}

const CubeSelect: React.ForwardRefRenderFunction<ICubeSelectRef, ICubeSelect> = (
  {
    data,
    onChange,
    label,
    type,
    validationRules,
    value,
    hideCustomButton,
    desc,
    fill,
    map,
    orientation,
  },
  ref
) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectItem, setSelectItem] = useState<ICubeItem>();
  const [selectedValue, setSelectedValue] = useState<string>();
  const [active, setActive] = useState<boolean>(false);
  const [showActionComponent, setShowActionComponent] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (data) {
      if (fill && fill.val && !active) {
        timer = setTimeout(() => {
          setError(false);
          setErrorMessage('');
          setSelectedValue(fill.val);
          if (onChange) onChange(fill.val);
        }, 200);
        setActive(true);
      }
    }
    // return clearTimeout(timer);
  }, [data, fill]);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      //   inputRef?.current?.focus();
    },
    checkValidation: () => {
      const errorCount = validate();
      return errorCount;
    },
    onSubmit: (item: ICubeItem, index: number) => {
      handleOnSelect(item, index);
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

  function handleOnSelect(item: ICubeItem, index: number) {
    setSelectedValue('');
    if (item.actionComponent) {
      setSelectItem(item);
      setShowActionComponent(true);
    }
    setSelectedIndex(index);
    if (onChange) onChange(item.val);
  }

  function renderCustom() {
    if (type && type === 'period') {
      return (
        <PeriodSelect
          onChange={(v) => {
            setError(false);
            setErrorMessage('');
            if (onChange) onChange(v);
          }}
        />
      );
    }
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

      <div
        className={
          orientation === 'horizontal'
            ? 'cube-container'
            : 'd-flex flex-wrap cube-container'
        }
        style={
          orientation === 'horizontal'
            ? {
                overflow: 'auto',
                whiteSpace: 'nowrap',
              }
            : {}
        }
      >
        {!showActionComponent &&
          data.map((d, index) => {
            return (
              <Button
                variant="outlined"
                style={
                  index === selectedIndex || d.val === selectedValue
                    ? {
                        color: '#B82887',
                        border: '1px solid #B82887',
                        background: '#FFF9FD',
                      }
                    : {}
                }
                onClick={(e) => handleOnSelect(d, index)}
              >
                {d.desc}
              </Button>
            );
          })}
        {!showActionComponent && !hideCustomButton && (
          <Button
            variant="outlined"
            style={{}}
            onClick={(e) => {
              setShowActionComponent(true);
            }}
          >
            Specify
          </Button>
        )}
        {!!showActionComponent ? renderCustom() : null}
      </div>

      {!!desc ? <div style={{ fontSize: 10, color: '#4B4B4B' }}>{desc}</div> : null}
    </div>
  );
};

export default forwardRef(CubeSelect);
