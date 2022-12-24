import { mock } from 'jest-mock-extended';
import { Model } from 'mongoose';
import ApiException from '../../../../src/core/error/api-exception';
import CurrencyService from '../../../../src/modules/currency/currency.service';
import { CurrencyDocument } from '../../../../src/schema/currency.schema';
import CreateCurrencyInput from '../../../../src/typings/currency/create-currency.input.dto';
import { Currency } from '../../../../src/typings/currency/currency.entity';

describe('Currency Service', () => {
  const model = mock<Model<CurrencyDocument>>();
  const currencyService = new CurrencyService(model);
  const currencyInput = mock<CreateCurrencyInput>();
  describe('create currency', () => {
    it('should return exception if currency already exists', async () => {
      model.findOne.mockResolvedValueOnce(mock<Currency>());
      await expect(currencyService.create(currencyInput)).rejects.toStrictEqual(
        ApiException.inputValidation(null, 'Currency already exists'),
      );
    });
  });
});
