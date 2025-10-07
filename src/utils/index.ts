import { DATE_FORMAT_TYPE } from '@/constants/common';
import { ERROR_API_MESSAGE } from '@/constants/error-message';
import get from 'lodash/get';
import isString from 'lodash/isString';
import moment from 'moment';

export const getErrorMessage = (response: any, message = '', mesgApi = true) => {
  if (isString(response)) return response || ERROR_API_MESSAGE[3];
  ERROR_API_MESSAGE;
  const errorMessage = mesgApi ? get(response, 'errorType', 3) : get(response, 'errorMessage');
  const getErrorMessage = mesgApi ? ERROR_API_MESSAGE?.[errorMessage] : errorMessage;
  const translatedMessage = getErrorMessage || ERROR_API_MESSAGE[3];
  return message || translatedMessage || errorMessage;
};
export const convertToDate = (value: any, format: string = DATE_FORMAT_TYPE.ymd) => {
  return !!value && moment(value).isValid() ? moment.utc(value).format(format) : '';
};
