import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateBusinessEntityDto {
  @IsNumber()
  @IsOptional()
  emissions: number;
}
