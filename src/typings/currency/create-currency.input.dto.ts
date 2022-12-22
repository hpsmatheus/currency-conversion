import { IsNumber, IsString } from 'class-validator';

export default class CreateCurrencyInput {
  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsNumber()
  usdQuotation: number;
}
