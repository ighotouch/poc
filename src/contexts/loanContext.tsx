import * as React from 'react';
import {
  ICreateLoan,
  ILoanState,
  INotificationDetails,
  ISalaryBand,
} from 'interfaces/loan';
import API from 'network/api';
import { IDocument, IUploadMeta } from 'interfaces/documents';
import { ICollateral } from 'interfaces/collateral';
import { useEffect } from 'react';
import {
  clearLoanApplication,
  getLoanApplication,
  storeLoanApplication,
} from 'common/localStorage';

const CONTEXT_ERROR =
  'Loan context not found. Have you wrapped your components with LoanContext.Consumer?';
type Action =
  | { type: 'SET_CREATE_LOAN'; data: ICreateLoan }
  | { type: 'UNSET_CREATE_LOAN' }
  | { type: 'SET_NOTIFICATIONS'; data: Array<INotificationDetails> }

type dispatch = {
  setLoanInfo: (info: ICreateLoan) => void;
  unSetLoanInfo: () => void;
  getNotifications: () => Promise<any>;
};

const LoanStateContext = React.createContext<ILoanState | undefined>(undefined);
const LoanDispatchContext = React.createContext<dispatch>({
  setLoanInfo: () => {
    throw new Error(CONTEXT_ERROR);
  },
  unSetLoanInfo: () => {
    throw new Error(CONTEXT_ERROR);
  },

  getNotifications: () => {
    throw new Error(CONTEXT_ERROR);
  },
});

function reducer(prevState: ILoanState, action: Action) {
  switch (action.type) {
    case 'SET_CREATE_LOAN':
      return {
        ...prevState,
        createLoan: { ...prevState.createLoan, ...action.data },
      };
    case 'UNSET_CREATE_LOAN':
      return {
        ...prevState,
        createLoan: {},
      };
    

    case 'SET_NOTIFICATIONS':
      return {
        ...prevState,
        notifications: action.data,
      };
  }
}

function LoanProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    createLoan: { amount: 0 },
    loans: [],
  });

  useEffect(() => {
    getLoanApplication().then((resp) => {
      dispatch({
        type: 'SET_CREATE_LOAN',
        data: resp,
      });
    });
  }, []);

  // actions
  const LoanDispatch = React.useMemo(
    () => ({
      setLoanInfo: async (info: ICreateLoan) => {
        dispatch({
          type: 'SET_CREATE_LOAN',
          data: info,
        });

        storeLoanApplication({ ...state.createLoan, ...info });
      },
      unSetLoanInfo: async () => {
        dispatch({
          type: 'UNSET_CREATE_LOAN',
        });

        clearLoanApplication();
      },

      getNotifications: async () => {
        const response = await API.getUserNotification();
        let notifications: Array<any> = [];
        if (response && response.statusCode === 200) {
          response.data.map((res) => {
            res.sender = 'Admin';
            return res;
          });
          notifications = response.data;
          const response2 = await API.getUserInAppNotification();
          if (response2 && response.statusCode === 200) {
            response2.data.map((res) => {
              res.sender = 'V Bank';
              return res;
            });
            notifications = [...notifications, ...response2.data].sort((a, b) =>
              a.createdAt > b.createdAt ? -1 : 1
            );
            dispatch({
              type: 'SET_NOTIFICATIONS',
              data: notifications,
            });
          }
        }
        return notifications;
      },
    }),
    [state]
  );

  return (
    <LoanStateContext.Provider value={state}>
      <LoanDispatchContext.Provider value={LoanDispatch}>
        {children}
      </LoanDispatchContext.Provider>
    </LoanStateContext.Provider>
  );
}

function useLoanState(): ILoanState {
  const context = React.useContext(LoanStateContext);
  if (context === undefined) {
    throw new Error('useLoanState must be used with a LoginProvider');
  }
  return context;
}

function useLoanDispatch(): dispatch {
  const context = React.useContext(LoanDispatchContext);
  if (context === undefined) {
    throw new Error('useLoanDispatch must be used with a LoginProvider');
  }
  return context;
}

export { useLoanDispatch, useLoanState, LoanProvider };
