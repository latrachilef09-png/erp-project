import { Test, TestingModule } from '@nestjs/testing';
import { InventoryCountsController } from './inventory-counts.controller';

describe('InventoryCountsController', () => {
  let controller: InventoryCountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryCountsController],
    }).compile();

    controller = module.get<InventoryCountsController>(InventoryCountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
