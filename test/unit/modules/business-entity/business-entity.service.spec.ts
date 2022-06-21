import { mock } from 'jest-mock-extended';
import BusinessEntityService from '../../../../src/modules/business-entity/business-entity.service';
import Constants from '../../../constants';
import DbService from '../../../../src/modules/database/db.service';
import { Querys } from '../../../../src/querys/busines-entity.query';
import CreateBusinessEntityDtoBuilder from '../../../mocks/create-business-entity.dto.builder';
import UpdateBusinessEntityDtoBuilder from '../../../mocks/update-business-entity.dto.builder';

describe('Business Entity Controller', () => {
  const dbSeriviceMock = mock<DbService>();
  const businessEntityService = new BusinessEntityService(dbSeriviceMock);
  describe('should call database service to', () => {
    it('GET the total emissions for a business entity', async () => {
      dbSeriviceMock.executeSum.mockResolvedValueOnce(Constants.anyNumber);
      const result = await businessEntityService.getTotalEmissions(
        Constants.anyNumber,
      );
      expect(result).toStrictEqual(Constants.anyNumber);
      expect(dbSeriviceMock.executeSum).toHaveBeenCalledWith(
        Querys.getTotalEmissions,
        [Constants.anyNumber],
      );
    });

    it('GET the names of full ancestry for a Business Entity', async () => {
      dbSeriviceMock.executeQuery.mockResolvedValueOnce([
        { name: Constants.anyString },
      ]);
      const result = await businessEntityService.getAncestryNames(
        Constants.anyNumber,
      );
      expect(result).toStrictEqual([Constants.anyString]);
      expect(dbSeriviceMock.executeQuery).toHaveBeenCalledWith(
        Querys.getAncestryNames,
        [Constants.anyNumber],
      );
    });

    it('CREATE new business entity', async () => {
      dbSeriviceMock.getSequenceNextValue.mockResolvedValueOnce(
        Constants.anyNumber,
      );
      dbSeriviceMock.executeQuery.mockResolvedValueOnce([]);

      const createDto = new CreateBusinessEntityDtoBuilder().build();
      const result = await businessEntityService.create(createDto);

      expect(result).toStrictEqual(Constants.anyNumber);
      expect(dbSeriviceMock.getSequenceNextValue).toHaveBeenCalledWith(
        Querys.getSequenceNextValue,
      );
      expect(dbSeriviceMock.executeQuery).toHaveBeenCalledWith(Querys.create, [
        Constants.anyNumber,
        createDto.name,
        createDto.parentId,
        Constants.anyNumber,
        createDto.emissions,
      ]);
    });

    it('SET emissions on a Business Entity', async () => {
      dbSeriviceMock.executeQuery.mockResolvedValueOnce([]);
      const updateDto = new UpdateBusinessEntityDtoBuilder().build();
      const result = await businessEntityService.update(
        Constants.anyNumber,
        updateDto,
      );
      expect(result).toStrictEqual(Constants.anyNumber);
      expect(dbSeriviceMock.executeQuery).toHaveBeenCalledWith(Querys.update, [
        updateDto.emissions,
        Constants.anyNumber,
      ]);
    });
  });
});
