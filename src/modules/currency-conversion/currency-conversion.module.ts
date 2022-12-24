import { Module } from '@nestjs/common';
import CurrencyConversionApiClient from '../../client/currency-conversion-api.client';
import CurrencyModule from '../currency/currency.module';
import CurrencyConversionController from './currency-conversion.controller';
import CurrencyConversionService from './currency-conversion.service';

@Module({
  imports: [CurrencyModule],
  controllers: [CurrencyConversionController],
  providers: [CurrencyConversionService, CurrencyConversionApiClient],
})
export default class CurrencyConversionModule {}
