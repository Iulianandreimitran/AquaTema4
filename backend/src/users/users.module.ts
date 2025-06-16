import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../roles/role.entity';
import { UserRole } from '../user-roles/user-role.entity';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Role, UserRole]),
  AuthModule,
  ], 
})
export class UsersModule {}
