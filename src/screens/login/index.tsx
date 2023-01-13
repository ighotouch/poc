import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useLoanDispatch } from 'contexts/loanContext';
import { clearLoanApplication } from 'common/localStorage';
import { useAuthState } from 'contexts/authContext';
import WrapperWithTopNavigation from 'containers/WrapperWithTopNavigation';
import Form from 'components/Form';

export interface ILogin {}
const Login: React.FC<ILogin> = () => {
  const { setLoanInfo } = useLoanDispatch();
  const timerRef = useRef<any>();
  const route = useHistory();
  const { profile } = useAuthState();

  useEffect(() => {
    clearLoanApplication();
    return clearTimeout(timerRef.current);
  }, []);

  const formData = useMemo(() => {
    return [
      {
        id: 'email',
        type: 'input',
        props: {
          inputType: 'email',
          validationRules: 'email|required',
          label: 'Email Address',
          placeholder: 'Email Address',
        },
      },
      {
        id: 'username',
        type: 'input',
        props: {
          validationRules: 'required',
          label: 'Username',
          placeholder: 'Username',
        },
      },
    ];
  }, []);

  function handleOnSubmit(data: any) {}
  return (
    <WrapperWithTopNavigation title="Login" containerStyle={{ marginTop: 70 }}>
      <div>
        <Form
          data={formData}
          buttonLabel="Login"
          onConfirm={handleOnSubmit}
          // noButton={}
        />
      </div>
    </WrapperWithTopNavigation>
  );
};

export default Login;
