import { Test, TestingModule } from '@nestjs/testing';
import { TrackingHistoriesController } from './tracking-histories.controller';
import { TrackingHistoriesService } from './tracking-histories.service';

describe('TrackingHistoriesController', () => {
  let controller: TrackingHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingHistoriesController],
      providers: [TrackingHistoriesService],
    }).compile();

    controller = module.get<TrackingHistoriesController>(TrackingHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
