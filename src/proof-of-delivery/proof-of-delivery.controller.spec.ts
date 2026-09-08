import { Test, TestingModule } from '@nestjs/testing';
import { ProofOfDeliveryController } from './proof-of-delivery.controller';
import { ProofOfDeliveryService } from './proof-of-delivery.service';

describe('ProofOfDeliveryController', () => {
  let controller: ProofOfDeliveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProofOfDeliveryController],
      providers: [ProofOfDeliveryService],
    }).compile();

    controller = module.get<ProofOfDeliveryController>(ProofOfDeliveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
