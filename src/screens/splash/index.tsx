import { setStorage } from 'common/localStorage';
import Loader from 'components/Loading';
import { useAuthDispatch } from 'contexts/authContext';
import {
  ComingSoonRoute,
  DashboardRoute,
  ErrorRoute,
  LoginRoute,
} from 'navigation/routes';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

export interface ISplash {}
const Splash: React.FC<ISplash> = () => {
  const { exchangeToken } = useAuthDispatch();
  const location = useLocation();
  const route = useHistory();
  useEffect(() => {
    // exchange token
    const params = new URLSearchParams(location.search);
    const token = params.get('x-token');
    const key = params.get('x-gate');
    async function handleExchangeToken(token: string, key: string | null) {
      try {
        const resp = await exchangeToken(token, key);
        if (resp && resp.status === 200) {
          if (resp.data.isAllowed && resp.data.token) {
            setStorage({ key: 'token', value: resp.data.token });
            route.push(DashboardRoute);
            return;
          } else if (resp.data.token) {
            route.push(ComingSoonRoute);
            return;
          }
        } // redirect to login screen
        route.push(ErrorRoute);
      } catch (error) {
        route.push(ErrorRoute);
      }
    }

 
    if (token) {
      handleExchangeToken(token, key);
    } else {
      // bad request
      route.push(ErrorRoute);
    }
  }, [exchangeToken, location, route]);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default Splash;
