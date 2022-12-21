import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import CurrencyConversionModule from './modules/currency-conversion/currency-conversion.module';

@Module({
  imports: [ConfigModule.forRoot(), CurrencyConversionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
