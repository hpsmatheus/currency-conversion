import { mock } from 'jest-mock-extended';
import BusinessEntityService from '../../../../src/modules/business-entity/business-entity.service';
import Constants from '../../../constants';
import BusinessEntityController from '../../../../src/modules/business-entity/business-entity.controller';
import CreateBusinessEntityDtoBuilder from '../../../mocks/create-business-entity.dto.builder';
import UpdateBusinessEntityDtoBuilder from '../../../mocks/update-business-entity.dto.builder';

describe('Business Entity Controller', () => {
  const serviceMock = mock<BusinessEntityService>();
  const controller = new BusinessEntityController(serviceMock);

  describe('should call service to', () => {
    it('GET the total emissions for a business entity', async () => {
      serviceMock.getTotalEmissions.mockResolvedValueOnce(Constants.anyNumber);
      const result = await controller.getTotalEmissions(Constants.anyNumber);
      expect(result).toStrictEqual(Constants.anyNumber);
      expect(serviceMock.getTotalEmissions).toHaveBeenCalledWith(
        Constants.anyNumber,
      );
    });

    it('GET the names of full ancestry for a Business Entity', async () => {
      serviceMock.getAncestryNames.mockResolvedValueOnce([Constants.anyString]);
      const result = await controller.getAncestryNames(Constants.anyNumber);
      expect(result).toStrictEqual([Constants.anyString]);
      expect(serviceMock.getAncestryNames).toHaveBeenCalledWith(
        Constants.anyNumber,
      );
    });

    it('CREATE new business entity', async () => {
      serviceMock.create.mockResolvedValueOnce(Constants.anyNumber);
      const createDto = new CreateBusinessEntityDtoBuilder().build();
      const result = await controller.create(createDto);
      expect(result).toStrictEqual(Constants.anyNumber);
      expect(serviceMock.create).toHaveBeenCalledWith(createDto);
    });

    it('SET emissions on a Business Entity', async () => {
      serviceMock.update.mockResolvedValueOnce(Constants.anyNumber);
      const updateDto = new UpdateBusinessEntityDtoBuilder().build();
      const result = await controller.update(Constants.anyNumber, updateDto);
      expect(result).toStrictEqual(Constants.anyNumber);
      expect(serviceMock.update).toHaveBeenCalledWith(
        Constants.anyNumber,
        updateDto,
      );
    });
  });
});
