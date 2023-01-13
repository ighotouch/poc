import { checkInputValidation, testMail } from 'common/Utilities';
import CubeSelect from 'components/CubeSelect';
import { MyInputHandles } from 'components/Input';
import Radio from 'components/Radio';
import SelectList from 'components/SelectList';
import TouchableButton from 'components/TouchableButton';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import TextInput from '../Input';
import useToast from 'hooks/useToast';

export interface IForm {
  data: Array<any>;
  onInputChanged?: (id: string, text: string) => void;
  innerContainerStyle?: any;
  onInputBlurred?: (id: string) => void;
  onSubmitPress?: () => void;
  noButton?: boolean;
  noPinValidation?: boolean;
  buttonLabel?: string;
  buttonStyle?: any;
  disabled?: boolean;
  loading?: boolean;
  onConfirm?: (state: { [key: string]: string }) => void;
  deep?: boolean;
  pinProps?: PinProps;
}

export interface PinProps {
  info: string;
  label: string;
  deep: boolean;
}

export interface formRef {
  submitForm(): void;
}

const Form: ForwardRefRenderFunction<formRef, IForm> = (
  {
    data,
    innerContainerStyle,
    onInputChanged,
    onInputBlurred,
    noButton,
    noPinValidation = true,
    buttonLabel,
    buttonStyle,
    onConfirm,
    disabled,
    loading,
    onSubmitPress,
  },
  ref
) => {
  const inputRefs = useRef<{ [key: string]: MyInputHandles }>({});
  const pinModalRef = useRef<any>(null);

  const [activeStep] = useState(0);
  const [state, setState] = useState<{ [key: string]: any }>({});
  const [currency] = useState('NGN');
  const [showOtp, setShowOtp] = useState(false);
  const Toast = useToast();

  useEffect(() => {}, [data]);

  function onValueChange(id: string, text: any) {
    const s = {
      ...state,
      [id]: text,
    };
    setState(s);
    if (onInputChanged) onInputChanged(id, text);
  }

  useImperativeHandle(ref, () => ({
    submitForm() {
      validate();
    },
  }));

  function renderSelectList(item: any, key: number) {
    const { id } = item;

    const value = state[id] ? state[id] : item.props ? item.props.text : '';
    return (
      <div>
        <SelectList
          disabled
          ref={(input) => {
            if (input) inputRefs.current[id + 'Select'] = input;
          }}
          key={key}
          value={value}
          onChange={(t: string) => {
            onValueChange(id, t);
          }}
          {...item.props}
        />
      </div>
    );
  }

  function renderRadio(item: any, key: number) {
    const { id } = item;

    const value = state[id] ? state[id] : item.props ? item.props.text : '';
    return (
      <div>
        <Radio
          disabled
          ref={(input) => {
            if (input) inputRefs.current[id + 'Radio'] = input;
          }}
          key={key}
          value={value}
          onChange={(t: string) => {
            onValueChange(id, t);
          }}
          {...item.props}
        />
      </div>
    );
  }

  function renderCubeList(item: any, key: number) {
    const { id } = item;
    return (
      <div>
        <CubeSelect
          disabled
          ref={(input) => {
            if (input) inputRefs.current[id + 'CubeSelect'] = input;
          }}
          value={state[id] ? state[id] : item.props ? item.props.text : ''}
          key={key}
          onChange={(t: string) => {
            onValueChange(id, t);
          }}
          {...item.props}
        />
      </div>
    );
  }

  function renderInput(item: any, key: number) {
    const nextItem = data[key + 1];
    const isNextFieldExisting = nextItem;

    const isNextFieldAnInput = isNextFieldExisting ? nextItem.type === 'input' : false;

    const { id } = item;
    if (!(id in state) && item.props) {
      if (item.props.text) onValueChange(id, item.props.text);
    }

    return (
      <div style={{ marginBottom: 31 }}>
        <TextInput
          editable={!disabled && !loading}
          innerContainerStyle={innerContainerStyle}
          textStyle={item.props ? item.props.style : {}}
          key={key}
          ref={(input) => {
            if (input) inputRefs.current[id + 'Input'] = input;
          }}
          onChangeText={(t) => onValueChange(id, t)}
          onBlur={() => (onInputBlurred ? onInputBlurred(id) : null)}
          value={id in state ? state[id] : item.props ? item.props.text : ''}
          returnKeyType={isNextFieldExisting && isNextFieldAnInput ? 'next' : 'done'}
          blurOnSubmit={isNextFieldExisting && isNextFieldAnInput ? false : true}
          onSubmitEditing={() => {
            if (isNextFieldExisting && isNextFieldAnInput) {
              if (inputRefs?.current[`${nextItem.id}Input`]) {
                inputRefs?.current[`${nextItem.id}Input`]?.focusInput();
                return;
              }

              if (inputRefs?.current[`${nextItem.id}PhoneNumber`]) {
                inputRefs?.current[`${nextItem.id}PhoneNumber`]?.focusInput();
              }
            }
          }}
          {...(item.props && item.props.format === 'amount'
            ? { currency: currency }
            : null)}
          {...item.props}
        />

        {item.descripton && (
          <div style={{}}>
            <div onClick={item.func}>
              <div style={{}}>{item.descripton}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleOtpSubmit = () => {
    setShowOtp(false);
    if (onConfirm) onConfirm(state);
  };

  function returnItemType(item: any, key: number) {
    if (item) {
      if (
        (item.step && activeStep < item.step) ||
        (item.props?.step && activeStep < item.props?.step)
      ) {
        return;
      }

      switch (item.type) {
        case 'input':
          return renderInput(item, key);

        case 'select':
          return renderSelectList(item, key);
        case 'radio':
          return renderRadio(item, key);

        case 'cubeSelect':
          return renderCubeList(item, key);

        case 'custom':
          return renderCustom(item, key);

        default:
          return React.cloneElement({ ...item.content, key: item.id }, { key });
      }
    }
  }

  function renderCustom(item: any, key: any) {
    if (item.content) {
      return React.cloneElement(item.content, { key });
    }
  }

  function renderContent() {
    if (data && data.length) {
      return data.map((item, key) => (
        <div key={key} style={{ marginTop: 17 }}>
          {returnItemType(item, key)}
        </div>
      ));
    }
  }

  function validate() {
    const elementsToValidate: Array<MyInputHandles> = [];

    data.map((item) => {
      if (item) {
        if (
          item.type === 'input' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'Input']);
        }
        if (
          item.type === 'select' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'Select']);
        }
        if (
          item.type === 'cubeSelect' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'CubeSelect']);
        }
        if (
          item.type === 'radio' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'Radio']);
        }
        if (
          item.type === 'withdrawal' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'withdrawal']);
        }
        if (
          item.type === 'switch' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'Switch']);
        }

        if (
          item.type === 'customAmount' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'amountInput']);
        }

        if (
          item.type === 'phoneNumber' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'PhoneNumber']);
        }

        if (
          item.type === 'customFundingSrc' &&
          item.props &&
          item.props.validationRules?.includes('required')
        ) {
          elementsToValidate.push(inputRefs?.current[item.id + 'customFundingSrc']);
        }
      }
    });

    if (noPinValidation) {
      if (state && state.email && !testMail(state.email))
        return Toast.error('Invalid email');
      if (checkInputValidation(elementsToValidate)) {
        if (onConfirm) onConfirm(state);
      }
    } else if (checkInputValidation(elementsToValidate)) {
      pinModalRef?.current?.toggle();
    }

    if (onSubmitPress) onSubmitPress();
  }

  function renderButton() {
    if (noButton) return;

    const button = (
      <div style={{ paddingTop: 30 }}>
        <TouchableButton
          onPress={validate}
          label={buttonLabel ? buttonLabel : ''}
          style={buttonStyle}
          //   loading={loading}
        />
      </div>
    );
    // if (steps && steps.length) {
    //   if (activeStep === _.last(this.state.steps)) {
    //     return button;
    //   }
    // } else {
    return button;
    // }
  }

  function pinCallback(pin: string) {
    pinModalRef?.current?.toggle();

    setTimeout(() => {
      if (onConfirm) onConfirm({ pin, ...state });
    }, 200);
  }

  function renderModals() {
    return (
      <>
        {/* <PINModal
          ref={pinModalRef}
          onChange={pinCallback}
          message={pinProps?.info}
        /> */}
        {/* <LoadingModal
                      loading={this.props.loading ? true : false}
                  />
                  <FeedbackModal
                      ref={(feedbackModal) => this.feedbackModal = feedbackModal}
                      errorCallback={this.triggerRetry}
                      successCallback={this.props.successCallback}
                  >{this.props.customFeedbackContent}</FeedbackModal> */}
      </>
    );
  }
  return (
    <>
      <div
        style={{
          ...(data && data.length > 0 ? { flexGrow: 1, paddingBottom: 10 } : {}),
        }}
      >
        <div style={{ flexGrow: 1 }}>{renderContent()}</div>
      </div>
      {!noButton ? renderButton() : null}
      {renderModals()}
    </>
  );
};

export default forwardRef(Form);
