export type ModalActions = 'ADD' | 'EDIT' | 'VIEW';

interface MODALS_ACTIONS_PROPS {
  [x: string]: ModalActions;
}

export const MODALS_ACTIONS: MODALS_ACTIONS_PROPS = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

export const DATE_FORMAT_TYPE = {
  dmy: 'DD/MM/YYYY',
  ymd: 'YYYY/MM/DD',
  dateTimeFormat: 'DD/MM/YYYY HH:mm',
  dateTimeFormatMinute: 'DD/MM/YYYY HH:mm:ss'
};

export const ALLOW_FILE_TYPE = ['jpg', 'jpeg', 'png', 'gif'];
