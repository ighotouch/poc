import { IExchangeTokenResp } from 'interfaces/auth';
import { IGetInappNotificationResponse, IGetNotificationRepsonse } from 'interfaces/loan';
import { requestMaker } from './request';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// AUTHENTICATION
const EXCHANGE_TOKEN = BASE_URL + '/auth/exchange';
const GET_COMMENTS = BASE_URL + '/comments';
const NOTIFICATIONS = BASE_URL + '/notifications';

// VALIANT ROUTES

function exchangeToken(token: string, key: string | null): Promise<IExchangeTokenResp> {
  return requestMaker({
    headers: { 'x-access-token': token, 'x-gate': key },
    type: 'GET',
    route: EXCHANGE_TOKEN,
  });
}

function getUserNotification(): Promise<IGetNotificationRepsonse> {
  return requestMaker({
    type: 'GET',
    route: GET_COMMENTS,
    isSecure: true,
  });
}

function getUserInAppNotification(): Promise<IGetInappNotificationResponse> {
  return requestMaker({
    type: 'GET',
    route: NOTIFICATIONS,
    isSecure: true,
  });
}

const exportObject = {
  exchangeToken,
  getUserNotification,
  getUserInAppNotification,
};

export default exportObject;
