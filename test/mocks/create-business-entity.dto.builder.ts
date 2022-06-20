import CreateBusinessEntityDto from '../../src/typings/dto/create-business-entity.dto';
import Constants from '../constants';

export default class CreateBusinessEntityDtoBuilder {
  private createBusinessEntityDto: CreateBusinessEntityDto;

  constructor() {
    this.createBusinessEntityDto = {
      name: Constants.anyString,
      parentId: Constants.anyNumber,
      emissions: Constants.anyNumber,
    };
  }

  public build(): CreateBusinessEntityDto {
    return this.createBusinessEntityDto;
  }
}
