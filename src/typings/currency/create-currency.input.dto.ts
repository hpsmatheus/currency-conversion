import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ECurrencyType } from './currency.entity';

export default class CreateCurrencyInput {
  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsNumber()
  @IsOptional()
  usdQuotation: number;

  @IsEnum(ECurrencyType)
  type: ECurrencyType;
}
