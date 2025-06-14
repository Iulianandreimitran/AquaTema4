import { Test, TestingModule } from '@nestjs/testing';
import { HotelGroupsController } from './hotel-groups.controller';
import { HotelGroupsService } from './hotel-groups.service';

describe('HotelGroupsController', () => {
  let controller: HotelGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelGroupsController],
      providers: [HotelGroupsService],
    }).compile();

    controller = module.get<HotelGroupsController>(HotelGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
