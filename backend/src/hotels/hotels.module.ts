import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Hotel } from './hotel.entity';
import { AuthModule } from '../auth/auth.module'; // ✅
import { JwtModule } from '@nestjs/jwt'; // ✅
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel, User]),
    AuthModule,  
    JwtModule.register({}), 
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
