import { Transform } from 'class-transformer';
import { Allow, IsNumber, IsString } from 'class-validator';

export default class CurrencyConversionParams {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @Allow()
  @IsNumber()
  amount: number;
}
