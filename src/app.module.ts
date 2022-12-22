import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import CurrencyConversionModule from './modules/currency-conversion/currency-conversion.module';
import { MongooseModule } from '@nestjs/mongoose';
import CurrencyModule from './modules/currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CurrencyModule,
    CurrencyConversionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
