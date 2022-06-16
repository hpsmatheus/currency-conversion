import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateBusinessEntityDto {
  @IsString()
  name: string;

  @IsNumber()
  parentId: number;

  @IsOptional()
  @IsNumber()
  emissions?: number;
}
