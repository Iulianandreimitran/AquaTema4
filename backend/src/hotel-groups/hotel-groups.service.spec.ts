import { Test, TestingModule } from '@nestjs/testing';
import { HotelGroupsService } from './hotel-groups.service';

describe('HotelGroupsService', () => {
  let service: HotelGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelGroupsService],
    }).compile();

    service = module.get<HotelGroupsService>(HotelGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
