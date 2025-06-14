import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Hotel } from '../hotels/hotel.entity';

@Entity('Cities')
export class City {
  @PrimaryGeneratedColumn()
  CityID: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  CityName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  Country: string;

  @OneToMany(() => Hotel, (hotel) => hotel.city)
  hotels: Hotel[];
}
