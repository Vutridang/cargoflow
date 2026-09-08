import { Test, TestingModule } from '@nestjs/testing';
import { ProofOfDeliveryService } from './proof-of-delivery.service';

describe('ProofOfDeliveryService', () => {
  let service: ProofOfDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProofOfDeliveryService],
    }).compile();

    service = module.get<ProofOfDeliveryService>(ProofOfDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
