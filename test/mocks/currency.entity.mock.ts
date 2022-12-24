import DateUtil from '../../src/core/date.util';
import {
  Currency,
  ECurrencyType,
} from '../../src/typings/currency/currency.entity';
import Constants from '../constants';

const fictious: Currency = {
  name: Constants.anyString,
  symbol: Constants.anyFictiousCurrency,
  type: ECurrencyType.FICTIOUS,
  createdAt: DateUtil.now(),
  updatedAt: DateUtil.now(),
  quotationCurrencyToUSD: 1.21,
  quotationUSDToCurrency: 0.37,
};

const crypto: Currency = {
  name: Constants.anyString,
  symbol: Constants.anyCryptoCurrency,
  type: ECurrencyType.CRYPTO,
  createdAt: DateUtil.now(),
  updatedAt: DateUtil.now(),
};

const fiat: Currency = {
  name: Constants.anyString,
  symbol: Constants.anyFiatCurrency,
  type: ECurrencyType.FIAT,
  createdAt: DateUtil.now(),
  updatedAt: DateUtil.now(),
};

export const currenciesMock = {
  fictious,
  crypto,
  fiat,
};
