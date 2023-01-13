import { IAuthState, IExchangeTokenResp, IGetUserResponse } from 'interfaces/auth';
import API from 'network/api';
import * as React from 'react';

const CONTEXT_ERROR =
  'Auth context not found. Have you wrapped your components with AuthContext.Consumer?';
type Action = { type: 'SET_PROFILE'; data: {} };

type dispatch = {
  exchangeToken: (toke: string, key: string | null) => Promise<IExchangeTokenResp>;
};


const AuthStateContext = React.createContext<IAuthState | undefined>(undefined);
const AuthDispatchContext = React.createContext<dispatch>({
  exchangeToken: () => {
    throw new Error(CONTEXT_ERROR);
  },
});

function reducer(prevState: IAuthState, action: Action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...prevState, profile: action.data };
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    profile: {},
  });

  // actions
  const AuthDispatch = React.useMemo(
    () => ({
      exchangeToken: async (token: string, key: string | null) => {
        const resp = await API.exchangeToken(token, key);
        if (resp && resp.data) {
          dispatch({
            type: 'SET_PROFILE',
            data: resp.data,
          });
        }
        return resp;
      },
      // getLoginEncryption: async () => {
      //   const response = await API.getAuthKey();
      //   return response;
      // },
      // getAuthUser: async () => API.getAuthenticatedUser(), // COMMENTED THIS FOR DISPLAY
    }),
    []
  );

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={AuthDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

function useAuthState(): IAuthState {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used with a AuthProvider');
  }
  return context;
}

function useAuthDispatch(): dispatch {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used with a AuthProvider');
  }
  return context;
}

export { useAuthDispatch, useAuthState, AuthProvider };
