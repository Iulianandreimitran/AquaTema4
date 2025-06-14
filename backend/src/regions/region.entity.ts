import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Hotel } from '../hotels/hotel.entity';

@Entity('Regions')
export class Region {
  @PrimaryGeneratedColumn()
  PropertyStateProvinceID: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  PropertyStateProvinceName: string;

  @OneToMany(() => Hotel, (hotel) => hotel.region)
  hotels: Hotel[];
}
