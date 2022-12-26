import CreateCurrencyInput from '../../../src/typings/currency/create-currency.input.dto';
import { ECurrencyType } from '../../../src/typings/currency/currency.entity';
import Constants from '../../constants';

export const createCurrencyInputMock: CreateCurrencyInput = {
  name: Constants.anyString,
  symbol: Constants.anyFiatCurrency,
  type: ECurrencyType.FIAT,
};
