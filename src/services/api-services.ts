import { ERROR_API_MESSAGE } from '@/constants/error-message';
import { getErrorMessage } from '@/utils';
import axios from 'axios';
import URL_PATHS from './url-path';
import { MESSAGES_CONFIRM } from '@/constants/messageConfirm';

const isHandlerEnabled = true;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf8',
    Accept: 'application/json-patch+json, text/javascript, */*; q=0.01',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 30000,
  timeoutErrorMessage: 'ExpiredTime',
  validateStatus(status: number) {
    return status >= 200 && status < 300;
  }
});

const requestHandler = async (request: any, isHandlerEnabled: boolean) => {
  if (isHandlerEnabled) {
  }
  const token = localStorage.getItem('token');
  if (token && isHandlerEnabled) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
};

const successHandler = (response: any, isHandlerEnabled: boolean) => {
  if (isHandlerEnabled) {
    //TODO: Do Success Handler
  }

  return response;
};

const refreshAccessToken = async () => {
  const Token = localStorage.getItem('token');
  const RefreshToken = localStorage.getItem('refreshToken');
  const params = {
    Token,
    RefreshToken
  };

  try {
    const response = await axiosInstance({
      method: 'POST',
      url: URL_PATHS.REFRESH_TOKEN,
      params: params
    });

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

const errorHandler = async (error: any, isHandlerEnabled?: boolean) => {
  console.log('🚀 ~ errorHandler ~ error:', error);
  const config = error?.config;
  if (error?.response?.status === 401) {
    if (!config._retry && config.url !== URL_PATHS.REFRESH_TOKEN && config !== URL_PATHS.SIG_IN) {
      try {
        const res = await refreshAccessToken();
        const { token, refreshToken } = res?.data?.content;

        if (token && refreshToken) {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          config._retry = true;
          config.headers.Authorization = `Bearer ${token}`;

          return axiosInstance(config);
        } else {
          alert(MESSAGES_CONFIRM.signInExpired);
          localStorage.clear();
          window.location.reload();
        }
      } catch (error) {
        alert(MESSAGES_CONFIRM.signInExpired);
        localStorage.clear();
        window.location.reload();
      }
    }
  } else {
    if (isHandlerEnabled) {
    }
    const customError = error.response
      ? {
          errorType: error.response.data?.errorType,
          errorMessage: error.response.data?.errorMessage
        }
      : error.message === 'ExpiredTime'
        ? {
            errorType: 'ExpiredTime',
            errorMessage: 'Expired Time'
          }
        : {
            errorType: 'UnhandledException',
            errorMessage: ERROR_API_MESSAGE[3]
          };

    return Promise.reject(customError);
  }
};

axiosInstance.interceptors.response.use(
  (response: any) => {
    return successHandler(response, isHandlerEnabled);
  },
  (error: any) => {
    return errorHandler(error);
  }
);

axiosInstance.interceptors.request.use(
  request => requestHandler(request, isHandlerEnabled),
  (error: any) => errorHandler(error)
);

export default axiosInstance;
