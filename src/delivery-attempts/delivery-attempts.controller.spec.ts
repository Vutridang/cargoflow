import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAttemptsController } from './delivery-attempts.controller';
import { DeliveryAttemptsService } from './delivery-attempts.service';

describe('DeliveryAttemptsController', () => {
  let controller: DeliveryAttemptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryAttemptsController],
      providers: [DeliveryAttemptsService],
    }).compile();

    controller = module.get<DeliveryAttemptsController>(DeliveryAttemptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
