import { IGlobalState } from 'interfaces/global';
import * as React from 'react';

const CONTEXT_ERROR =
  'Global context not found. Have you wrapped your components with GlobalContext.Consumer?';
type Action = { type: 'SET_PROFILE'; data: {} };

type dispatch = {
  loadProfile: () => Promise<any>;
};

const GlobalStateContext = React.createContext<IGlobalState | undefined>(undefined);
const GlobalDispatchContext = React.createContext<dispatch>({
  loadProfile: () => {
    throw new Error(CONTEXT_ERROR);
  },
});

function reducer(prevState: IGlobalState, action: Action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...prevState, profile: action.data };
  }
}

function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    profile: {},
  });

  // actions
  const GlobalDispatch = React.useMemo(
    () => ({
      loadProfile: async () => {
        dispatch({
          type: 'SET_PROFILE',
          data: {},
        });
      },
    }),
    []
  );

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={GlobalDispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

function useGlobalState(): IGlobalState {
  const context = React.useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used with a LoginProvider');
  }
  return context;
}

function useGlobalDispatch(): dispatch {
  const context = React.useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used with a LoginProvider');
  }
  return context;
}

export { useGlobalDispatch, useGlobalState, GlobalProvider };
