import { Module } from '@nestjs/common';
import CurrencyConversionApiClient from 'src/client/currency-conversion-api.client';
import CurrencyConversionController from './currency-conversion.controller';
import CurrencyConversionService from './currency-conversion.service';

@Module({
  controllers: [CurrencyConversionController],
  providers: [CurrencyConversionService, CurrencyConversionApiClient],
})
export default class CurrencyConversionModule {}
