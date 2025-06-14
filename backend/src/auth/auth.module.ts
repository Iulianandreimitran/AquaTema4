import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { UserRole } from 'src/user-roles/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role,UserRole])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}