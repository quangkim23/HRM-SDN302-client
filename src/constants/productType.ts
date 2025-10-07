export type field = {
  field: string;
  title: string;
  type: string;
  isActive?: boolean;
};
export type accordionField = {
  title: string;
  fields: field[];
};
export const CLIENT_FIELD_TABLE: field[] = [
  {
    field: 'clientName',
    title: 'Client Name',
    type: 'text',
    isActive: true
  },
  {
    field: 'branchId',
    title: 'Branch Id',
    type: 'text'
  },
  {
    field: 'branchDescription',
    title: 'Branch Description',
    type: 'text'
  },
  {
    field: 'registrationDate',
    title: 'Registration Date',
    type: 'date'
  },
  {
    field: 'cancellationDate',
    title: 'Cancellation Date',
    type: 'date'
  },
  {
    field: 'fiscalAddress',
    title: ' Fiscal Address ',
    type: 'text'
  },
  {
    field: 'domicile',
    title: 'Domicile',
    type: 'text'
  },
  {
    field: 'countryId',
    title: 'CountryId',
    type: 'text',
    isActive: true
  },
  {
    field: 'provinceCode',
    title: 'Province Code',
    type: 'text'
  },
  {
    field: 'provinceDescription',
    title: 'Province Description',
    type: 'text'
  },
  {
    field: 'localityId',
    title: 'LocalityId',
    type: 'number'
  },
  {
    field: 'localityDescription',
    title: 'LocalityDescription',
    type: 'text'
  },
  {
    field: 'latitude',
    title: 'Latitude',
    type: 'number'
  },
  {
    field: 'longitude',
    title: 'Longitude',
    type: 'number'
  },
  {
    field: 'phoneNumbers',
    title: 'Phone Numbers',
    type: 'text',
    isActive: true
  },
  {
    field: 'mobile',
    title: 'Mobile',
    type: 'text'
  },
  {
    field: 'email',
    title: 'Email',
    type: 'text',
    isActive: true
  },
  {
    field: 'taxType',
    title: 'Tax Type',
    type: 'text',
    isActive: true
  },
  {
    field: 'description',
    title: 'Description',
    type: 'text'
  },
  {
    field: 'clientIdAlternate',
    title: 'ClientId Alternate',
    type: 'text'
  },
  {
    field: 'alternateIdDescription',
    title: 'AlternateId Description',
    type: 'text'
  },
  {
    field: 'taxIdNumber',
    title: 'TaxId Number',
    type: 'text',
    isActive: true
  }
];
// type Client = {
//   clientName: string;
//   branchId: number;
//   branchDescription: string;
//   registrationDate: string;
//   isCanceled: boolean;
//   cancellationDate: string;
//   fiscalAddress: string;
//   domicile: string;
//   countryId: string;
//   provinceCode: string;
//   provinceDescription: string;
//   phoneNumbers: string;
//   mobile: string;
//   email: string;
//   taxType: string;
//   description: string;
//   clientIdAlternate: string;
//   alternateIdDescription: string;
//   taxIdNumber: string;
// };
export const CLIENT_DATA: accordionField[] = [
  {
    title: 'Basic Information',
    fields: [
      {
        field: 'clientId',
        title: 'Client Id',
        type: 'number'
      },
      {
        field: 'clientName',
        title: 'Client Name',
        type: 'text',
        isActive: true
      },
      {
        field: 'branchId',
        title: 'Branch Id',
        type: 'number'
      },
      {
        field: 'branchDescription',
        title: 'Branch Description',
        type: 'text'
      },
      {
        field: 'registrationDate',
        title: 'Registration Date',
        type: 'date'
      },
      {
        field: 'isCanceled',
        title: 'Is Canceled',
        type: 'boolean'
      },
      {
        field: 'cancellationDate',
        title: 'Cancellation Date',
        type: 'date'
      }
    ]
  },

  {
    title: 'Contact Information',
    fields: [
      {
        field: 'phoneNumbers',
        title: 'Phone Numbers',
        type: 'text',
        isActive: true
      },
      {
        field: 'mobile',
        title: 'Mobile',
        type: 'text'
      },
      {
        field: 'email',
        title: 'Email',
        type: 'text',
        isActive: true
      }
    ]
  },
  {
    title: 'Address & Location',
    fields: [
      {
        field: 'fiscalAddress',
        title: 'Fiscal Address',
        type: 'text'
      },
      {
        field: 'domicile',
        title: 'Domicile',
        type: 'text'
      },
      {
        field: 'countryId',
        title: 'Country Id',
        type: 'text',
        isActive: true
      },
      {
        field: 'provinceCode',
        title: 'Province Code',
        type: 'text'
      },
      {
        field: 'provinceDescription',
        title: 'Province Description',
        type: 'text'
      },
      {
        field: 'localityId',
        title: 'Locality Id',
        type: 'number'
      },
      {
        field: 'localityDescription',
        title: 'Locality Description',
        type: 'text'
      },
      {
        field: 'latitude',
        title: 'Latitude',
        type: 'number'
      },
      {
        field: 'longitude',
        title: 'Longitude',
        type: 'number'
      }
    ]
  },
  {
    title: 'Tax & Financial Information',
    fields: [
      {
        field: 'taxType',
        title: 'Tax Type',
        type: 'text',
        isActive: true
      },
      {
        field: 'description',
        title: 'Description',
        type: 'text'
      },
      {
        field: 'taxIdNumber',
        title: 'Tax Id Number',
        type: 'number',
        isActive: true
      },
      {
        field: 'exemptionNumber',
        title: 'Exemption Number',
        type: 'number'
      },
      {
        field: 'grossIncome',
        title: 'Gross Income',
        type: 'number'
      },
      {
        field: 'exemptionId',
        title: 'Exemption Id',
        type: 'number'
      },
      {
        field: 'alcoholTax',
        title: 'Alcohol Tax',
        type: 'number'
      },
      {
        field: 'alcoholSales',
        title: 'Alcohol Sales',
        type: 'date'
      }
    ]
  },
  {
    title: 'Payment Information',
    fields: [
      {
        field: 'paymentDays',
        title: 'Payment Days',
        type: 'number'
      },
      {
        field: 'paymentMethod',
        title: 'Payment Method',
        type: 'number'
      },
      {
        field: 'agentAgent',
        title: 'Agent',
        type: 'number'
      },
      {
        field: 'agreement',
        title: 'Agreement',
        type: 'number'
      },
      {
        field: 'provinceSCM05',
        title: 'Province SCM05',
        type: 'number'
      }
    ]
  },
  {
    title: 'Client Categorization',
    fields: [
      {
        field: 'priceCode',
        title: 'Price Code',
        type: 'number'
      },
      {
        field: 'title',
        title: 'Title',
        type: 'text'
      },
      {
        field: 'insuranceId',
        title: 'Insurance Id',
        type: 'number'
      },
      {
        field: 'insuranceDescription',
        title: 'Insurance Description',
        type: 'text'
      },
      {
        field: 'canalCode',
        title: 'Canal Code',
        type: 'number'
      },
      {
        field: 'subChannelDescription',
        title: 'Sub Channel Description',
        type: 'text'
      },
      {
        field: 'channelId',
        title: 'Channel Id',
        type: 'number'
      },
      {
        field: 'channelDescription',
        title: 'Channel Description',
        type: 'text'
      }
    ]
  },
  {
    title: 'Business & Marketing Information',
    fields: [
      {
        field: 'marketingSegmentId',
        title: 'Marketing Segment Id',
        type: 'number'
      },
      {
        field: 'marketingSegmentDescription',
        title: 'Marketing Segment Description',
        type: 'text'
      },
      {
        field: 'businessCode',
        title: 'Business Code',
        type: 'number'
      },
      {
        field: 'businessDescription',
        title: 'Business Description',
        type: 'text'
      },
      {
        field: 'areaCode',
        title: 'Area Code',
        type: 'number'
      },
      {
        field: 'areaDescription',
        title: 'Area Description',
        type: 'text'
      },
      {
        field: 'groupCode',
        title: 'Group Code',
        type: 'number'
      },
      {
        field: 'groupDescription',
        title: 'Group Description',
        type: 'text'
      }
    ]
  },
  {
    title: 'Sales Information',
    fields: [
      {
        field: 'tradeFocus',
        title: 'Trade Focus',
        type: 'number'
      },
      {
        field: 'salesFocus',
        title: 'Sales Focus',
        type: 'number'
      },
      {
        field: 'subCategoryFocusId',
        title: 'Sub Category Focus Id',
        type: 'number'
      },
      {
        field: 'tradeCluster',
        title: 'Trade Cluster',
        type: 'text'
      }
    ]
  },
  {
    title: 'Order & Limitations',
    fields: [
      {
        field: 'articleLimit',
        title: 'Article Limit',
        type: 'number'
      },
      {
        field: 'quantityLimit',
        title: 'Quantity Limit',
        type: 'number'
      },
      {
        field: 'pesoLimit',
        title: 'Peso Limit',
        type: 'number'
      }
    ]
  },
  {
    title: 'Miscellaneous',
    fields: [
      {
        field: 'clientIdAlternate',
        title: 'Client Id Alternate',
        type: 'text'
      },
      {
        field: 'alternateIdDescription',
        title: 'Alternate Id Description',
        type: 'text'
      },
      {
        field: 'comments',
        title: 'Comments',
        type: 'text'
      },
      {
        field: 'openingHours',
        title: 'Opening Hours',
        type: 'text'
      },
      {
        field: 'documentId',
        title: 'Document Id',
        type: 'text'
      },
      {
        field: 'departmentDescription',
        title: 'Department Description',
        type: 'text'
      },
      {
        field: 'openingWindow',
        title: 'Opening Window',
        type: 'time'
      },
      {
        field: 'closingWindow',
        title: 'Closing Window',
        type: 'time'
      }
    ]
  }
];
export const FIELD_TABLE_DATA: field[] = [
  { field: 'clientId', title: 'Client Id', type: 'number', isActive: true },
  { field: 'clientName', title: 'Client Name', type: 'text', isActive: true },
  { field: 'branchId', title: 'Branch Id', type: 'number' },
  { field: 'branchDescription', title: 'Branch Description', type: 'text', isActive: true },
  { field: 'registrationDate', title: 'Registration Date', type: 'date' },
  { field: 'isCanceled', title: 'Is Canceled', type: 'boolean' },
  { field: 'cancellationDate', title: 'Cancellation Date', type: 'date' },
  { field: 'phoneNumbers', title: 'Phone Numbers', type: 'text', isActive: true },
  { field: 'mobile', title: 'Mobile', type: 'text', isActive: true },
  { field: 'email', title: 'Email', type: 'text', isActive: true },
  { field: 'fiscalAddress', title: 'Fiscal Address', type: 'text' },
  { field: 'domicile', title: 'Domicile', type: 'text' },
  { field: 'countryId', title: 'CountryId', type: 'text' },
  { field: 'provinceCode', title: 'Province Code', type: 'text' },
  { field: 'provinceDescription', title: 'Province Description', type: 'text' },
  { field: 'localityId', title: 'LocalityId', type: 'number' },
  { field: 'localityDescription', title: 'LocalityDescription', type: 'text' },
  { field: 'latitude', title: 'Latitude', type: 'number' },
  { field: 'longitude', title: 'Longitude', type: 'number' },
  { field: 'taxType', title: 'Tax Type', type: 'text' },
  { field: 'description', title: 'Description', type: 'text' },
  { field: 'taxIdNumber', title: 'TaxId Number', type: 'number' },
  { field: 'exemptionNumber', title: 'Exemption Number', type: 'number' },
  { field: 'grossIncome', title: 'Gross Income', type: 'number' },
  { field: 'exemptionId', title: 'Exemption Id', type: 'number' },
  { field: 'alcoholTax', title: 'Alcohol Tax', type: 'number' },
  { field: 'alcoholSales', title: 'Alcohol Sales', type: 'date' },
  { field: 'paymentDays', title: 'Payment Days', type: 'number' },
  { field: 'paymentMethod', title: 'Payment Method', type: 'number' },
  { field: 'agentAgent', title: 'Agent', type: 'number' },
  { field: 'agreement', title: 'Agreement', type: 'number' },
  { field: 'provinceSCM05', title: 'Province SCM05', type: 'number' },
  { field: 'priceCode', title: 'Price Code', type: 'number' },
  { field: 'title', title: 'Title', type: 'text' },
  { field: 'insuranceId', title: 'Insurance Id', type: 'number' },
  { field: 'insuranceDescription', title: 'Insurance Description', type: 'text' },
  { field: 'canalCode', title: 'Canal Code', type: 'number' },
  { field: 'subChannelDescription', title: 'Sub Channel Description', type: 'text' },
  { field: 'channelId', title: 'Channel Id', type: 'number' },
  { field: 'channelDescription', title: 'Channel Description', type: 'text' },
  { field: 'marketingSegmentId', title: 'Marketing Segment Id', type: 'number' },
  {
    field: 'marketingSegmentDescription',
    title: 'Marketing Segment Description',
    type: 'text'
  },
  { field: 'businessCode', title: 'Business Code', type: 'number' },
  { field: 'businessDescription', title: 'Business Description', type: 'text' },
  { field: 'areaCode', title: 'Area Code', type: 'number' },
  { field: 'areaDescription', title: 'Area Description', type: 'text' },
  { field: 'groupCode', title: 'Group Code', type: 'number' },
  { field: 'groupDescription', title: 'Group Description', type: 'text' },
  { field: 'tradeFocus', title: 'Trade Focus', type: 'number' },
  { field: 'salesFocus', title: 'Sales Focus', type: 'number' },
  { field: 'subCategoryFocusId', title: 'Sub Category Focus Id', type: 'number' },
  { field: 'tradeCluster', title: 'Trade Cluster', type: 'text' },
  { field: 'articleLimit', title: 'Article Limit', type: 'number' },
  { field: 'quantityLimit', title: 'Quantity Limit', type: 'number' },
  { field: 'pesoLimit', title: 'Peso Limit', type: 'number' },
  { field: 'clientIdAlternate', title: 'ClientId Alternate', type: 'text' },
  { field: 'alternateIdDescription', title: 'AlternateId Description', type: 'text' },
  { field: 'comments', title: 'Comments', type: 'text' },
  { field: 'openingHours', title: 'Opening Hours', type: 'text' },
  { field: 'documentId', title: 'Document Id', type: 'text' },
  { field: 'departmentDescription', title: 'Department Description', type: 'text' },
  { field: 'openingWindow', title: 'Opening Window', type: 'time' },
  { field: 'closingWindow', title: 'Closing Window', type: 'time' }
];
