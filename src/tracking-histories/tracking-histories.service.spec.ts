import { Test, TestingModule } from '@nestjs/testing';
import { TrackingHistoriesService } from './tracking-histories.service';

describe('TrackingHistoriesService', () => {
  let service: TrackingHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackingHistoriesService],
    }).compile();

    service = module.get<TrackingHistoriesService>(TrackingHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
