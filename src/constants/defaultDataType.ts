export type DataType = {
  [key: string]: {
    field: string;
    title: string;
    type: string;
  };
};
export const defaultDataType: DataType = {
  clientId: { field: 'clientId', title: 'Client Id', type: 'number' },
  clientName: { field: 'clientName', title: 'Client Name', type: 'text' },
  branchId: { field: 'branchId', title: 'Branch Id', type: 'number' },
  branchDescription: { field: 'branchDescription', title: 'Branch Description', type: 'text' },
  registrationDate: { field: 'registrationDate', title: 'Registration Date', type: 'date' },
  isCanceled: { field: 'isCanceled', title: 'Is Canceled', type: 'boolean' },
  cancellationDate: { field: 'cancellationDate', title: 'Cancellation Date', type: 'date' },
  phoneNumbers: { field: 'phoneNumbers', title: 'Phone Numbers', type: 'text' },
  mobile: { field: 'mobile', title: 'Mobile', type: 'text' },
  email: { field: 'email', title: 'Email', type: 'text' },
  fiscalAddress: { field: 'fiscalAddress', title: 'Fiscal Address', type: 'text' },
  domicile: { field: 'domicile', title: 'Domicile', type: 'text' },
  countryId: { field: 'countryId', title: 'CountryId', type: 'text' },
  provinceCode: { field: 'provinceCode', title: 'Province Code', type: 'text' },
  provinceDescription: { field: 'provinceDescription', title: 'Province Description', type: 'text' },
  localityId: { field: 'localityId', title: 'LocalityId', type: 'number' },
  localityDescription: { field: 'localityDescription', title: 'LocalityDescription', type: 'text' },
  latitude: { field: 'latitude', title: 'Latitude', type: 'number' },
  longitude: { field: 'longitude', title: 'Longitude', type: 'number' },
  taxType: { field: 'taxType', title: 'Tax Type', type: 'text' },
  description: { field: 'description', title: 'Description', type: 'text' },
  taxIdNumber: { field: 'taxIdNumber', title: 'TaxId Number', type: 'text' },
  exemptionNumber: { field: 'exemptionNumber', title: 'Exemption Number', type: 'number' },
  grossIncome: { field: 'grossIncome', title: 'Gross Income', type: 'number' },
  exemptionId: { field: 'exemptionId', title: 'Exemption Id', type: 'number' },
  alcoholTax: { field: 'alcoholTax', title: 'Alcohol Tax', type: 'number' },
  alcoholSales: { field: 'alcoholSales', title: 'Alcohol Sales', type: 'date' },
  paymentDays: { field: 'paymentDays', title: 'Payment Days', type: 'number' },
  paymentMethod: { field: 'paymentMethod', title: 'Payment Method', type: 'number' },
  agentAgent: { field: 'agentAgent', title: 'Agent', type: 'number' },
  agreement: { field: 'agreement', title: 'Agreement', type: 'number' },
  provinceSCM05: { field: 'provinceSCM05', title: 'Province SCM05', type: 'number' },
  priceCode: { field: 'priceCode', title: 'Price Code', type: 'number' },
  title: { field: 'title', title: 'Title', type: 'text' },
  insuranceId: { field: 'insuranceId', title: 'Insurance Id', type: 'number' },
  insuranceDescription: { field: 'insuranceDescription', title: 'Insurance Description', type: 'text' },
  canalCode: { field: 'canalCode', title: 'Canal Code', type: 'number' },
  subChannelDescription: { field: 'subChannelDescription', title: 'Sub Channel Description', type: 'text' },
  channelId: { field: 'channelId', title: 'Channel Id', type: 'number' },
  channelDescription: { field: 'channelDescription', title: 'Channel Description', type: 'text' },
  marketingSegmentId: { field: 'marketingSegmentId', title: 'Marketing Segment Id', type: 'number' },
  marketingSegmentDescription: {
    field: 'marketingSegmentDescription',
    title: 'Marketing Segment Description',
    type: 'text'
  },
  businessCode: { field: 'businessCode', title: 'Business Code', type: 'number' },
  businessDescription: { field: 'businessDescription', title: 'Business Description', type: 'text' },
  areaCode: { field: 'areaCode', title: 'Area Code', type: 'number' },
  areaDescription: { field: 'areaDescription', title: 'Area Description', type: 'text' },
  groupCode: { field: 'groupCode', title: 'Group Code', type: 'number' },
  groupDescription: { field: 'groupDescription', title: 'Group Description', type: 'text' },
  tradeFocus: { field: 'tradeFocus', title: 'Trade Focus', type: 'number' },
  salesFocus: { field: 'salesFocus', title: 'Sales Focus', type: 'number' },
  subCategoryFocusId: { field: 'subCategoryFocusId', title: 'Sub Category Focus Id', type: 'number' },
  tradeCluster: { field: 'tradeCluster', title: 'Trade Cluster', type: 'text' },
  articleLimit: { field: 'articleLimit', title: 'Article Limit', type: 'number' },
  quantityLimit: { field: 'quantityLimit', title: 'Quantity Limit', type: 'number' },
  pesoLimit: { field: 'pesoLimit', title: 'Peso Limit', type: 'number' },
  clientIdAlternate: { field: 'clientIdAlternate', title: 'ClientId Alternate', type: 'text' },
  alternateIdDescription: { field: 'alternateIdDescription', title: 'AlternateId Description', type: 'text' },
  comments: { field: 'comments', title: 'Comments', type: 'text' },
  openingHours: { field: 'openingHours', title: 'Opening Hours', type: 'text' },
  documentId: { field: 'documentId', title: 'Document Id', type: 'text' },
  departmentDescription: { field: 'departmentDescription', title: 'Department Description', type: 'text' },
  openingWindow: { field: 'openingWindow', title: 'Opening Window', type: 'time' },
  closingWindow: { field: 'closingWindow', title: 'Closing Window', type: 'time' }
};
export interface OptionResult {
  id: string;
  result: string;
}

export interface Menu {
  id: string;
  index: number;
  name: string;
  optionResults: OptionResult[];
  status: number;
}

export interface Data {
  id: string;
  index: number;
  menus: Menu[];
  name: string;
  status: number;
  type: number;
}
