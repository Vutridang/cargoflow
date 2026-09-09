import { Test, TestingModule } from '@nestjs/testing';
import { TripShipmentsController } from './trip-shipments.controller';
import { TripShipmentsService } from './trip-shipments.service';

describe('TripShipmentsController', () => {
  let controller: TripShipmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripShipmentsController],
      providers: [TripShipmentsService],
    }).compile();

    controller = module.get<TripShipmentsController>(TripShipmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
