import { Module } from '@nestjs/common';
import { HotelGroupsService } from './hotel-groups.service';
import { HotelGroupsController } from './hotel-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelGroup } from './entities/hotel-group.entity';
import { Hotel } from '../hotels/hotel.entity';
import { HotelsModule } from '../hotels/hotels.module';
import { AuthModule } from '../auth/auth.module'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([HotelGroup, Hotel]),
    HotelsModule,
    AuthModule,
  ],
  controllers: [HotelGroupsController],
  providers: [HotelGroupsService],
})
export class HotelGroupsModule {}
