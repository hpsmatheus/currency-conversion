import DateUtil from '../src/core/date.util';

const Constants = {
  anyString: 'anyString',
  anyNumber: 1,
  anyObject: { property: 'property' },
  anyUuid: 'fd80b461-f869-4dc0-bd33-d2b0d950355d',
  anyDestinationCurrency: 'EUR',
  anyFictiousCurrency: 'SWT',
  anyCryptoCurrency: 'BTC',
  anyFiatCurrency: 'BRL',
  USDCurrency: 'USD',
  anyQuotation: 1.73,
  anyAmout: 10,
  anyDate: DateUtil.now(),
};

export default Constants;
