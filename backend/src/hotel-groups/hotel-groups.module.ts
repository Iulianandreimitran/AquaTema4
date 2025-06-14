import { Module } from '@nestjs/common';
import { HotelGroupsService } from './hotel-groups.service';
import { HotelGroupsController } from './hotel-groups.controller';

@Module({
  controllers: [HotelGroupsController],
  providers: [HotelGroupsService],
})
export class HotelGroupsModule {}
