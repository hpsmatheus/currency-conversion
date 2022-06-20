import UpdateBusinessEntityDto from '../../src/typings/dto/update-business-entity.dto';
import Constants from '../constants';

export default class UpdateBusinessEntityDtoBuilder {
  private updateBusinessEntity: UpdateBusinessEntityDto;

  constructor() {
    this.updateBusinessEntity = {
      emissions: Constants.anyNumber,
    };
  }

  public build(): UpdateBusinessEntityDto {
    return this.updateBusinessEntity;
  }
}
