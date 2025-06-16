import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { RolesModule } from './roles/roles.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { Role } from './roles/role.entity';
import { UserRole } from './user-roles/user-role.entity';
import { Permission } from './permissions/permission.entity';
import { RolePermission } from './role-permissions/role-permission.entity';
import { HotelsModule } from './hotels/hotels.module';
import { CitiesModule } from './cities/cities.module';
import { RegionsModule } from './regions/regions.module';
import { HotelGroupsModule } from './hotel-groups/hotel-groups.module';
import { HotelGroup } from './hotel-groups/entities/hotel-group.entity';
import { Hotel } from './hotels/hotel.entity';
import { City } from './cities/city.entity';
import { Region } from './regions/region.entity';
import { AuthModule } from './auth/auth.module';
import { HotelReviewsModule } from './hotel-reviews/hotel-reviews.module';
import { HotelReview } from './hotel-reviews/entities/hotel-review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      // migrations: ['dist/migrations/*.js'],
      // migrationsRun: true,
      entities: [User, Role, UserRole, Permission, RolePermission, HotelGroup,Hotel,City,Region,HotelReview],
    }),

    UsersModule,

    RolesModule,

    UserRolesModule,

    PermissionsModule,

    RolePermissionsModule,

    HotelsModule,

    CitiesModule,

    RegionsModule,

    HotelGroupsModule,
    AuthModule,
    HotelReviewsModule
  ],
})
export class AppModule {}
