import { HotelReview } from 'src/hotel-reviews/entities/hotel-review.entity';
import { Hotel } from 'src/hotels/hotel.entity';
import { UserRole } from 'src/user-roles/user-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  rememberToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => Hotel, (hotel) => hotel.admin)
  adminHotels: Hotel[];

  @OneToMany( ()=> Hotel, (hotel) => hotel.manager)
  managerHotel: Hotel

  @OneToMany(() => HotelReview, (review) => review.user)
  reviews: HotelReview[];
}
