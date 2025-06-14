import { Hotel } from 'src/hotels/hotel.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('hotel_groups')
export class HotelGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'managerId' }) 
  manager: User;

  @Column({ type: 'int', nullable: false, unique: true }) // unique
  managerId: number;

  @OneToMany(() => Hotel, (hotel) => hotel.group)
  hotels: Hotel[];
}
