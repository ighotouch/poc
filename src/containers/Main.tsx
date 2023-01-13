import SuspenseLoader from 'components/SuspenseLoader';
import { AuthProvider } from 'contexts/authContext';
import { GlobalProvider } from 'contexts/globalContext';
import { LoanProvider } from 'contexts/loanContext';
import {
  DashboardRoute,
  ErrorRoute,
  SplashRoute,
  LoginRoute,
  ComingSoonRoute,
} from 'navigation/routes';
import { lazy, Suspense } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import ToastContainer from 'components/ToastContainer/ToastContainer';


const LoginScreen = lazy(() => import('screens/login'));

const SplashScreen = lazy(() => import('../screens/splash'));
const DashboardScreen = lazy(() => import('../screens/dashboard'));
const ErrorScreen = lazy(() => import('../screens/error'));

const ComingSoon = lazy(() => import('../screens/comingSoon'));


const Main = () => {

  return (
    <ToastProvider components={{ ToastContainer }}>
      <GlobalProvider>
        <AuthProvider>
          <LoanProvider>
            <div className="">
              <main className="">
                <Suspense fallback={<SuspenseLoader />}>
                  <BrowserRouter>
                    <Switch>
                      <Route path={LoginRoute} exact component={LoginScreen} />
                      <Route path={SplashRoute} exact component={SplashScreen} />
                      <Route path={ComingSoonRoute} exact component={ComingSoon} />
                      <Route path={DashboardRoute} exact component={DashboardScreen} />
                      <Route path={ErrorRoute} exact component={ErrorScreen} />
                      
                    </Switch>
                  </BrowserRouter>
                </Suspense>
              </main>
            </div>
          </LoanProvider>
        </AuthProvider>
      </GlobalProvider>
    </ToastProvider>
  );
};

export default Main;
