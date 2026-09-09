import { Test, TestingModule } from '@nestjs/testing';
import { TripShipmentsService } from './trip-shipments.service';

describe('TripShipmentsService', () => {
  let service: TripShipmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripShipmentsService],
    }).compile();

    service = module.get<TripShipmentsService>(TripShipmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
