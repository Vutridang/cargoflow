import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryAttemptsService } from './delivery-attempts.service';

describe('DeliveryAttemptsService', () => {
  let service: DeliveryAttemptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryAttemptsService],
    }).compile();

    service = module.get<DeliveryAttemptsService>(DeliveryAttemptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
