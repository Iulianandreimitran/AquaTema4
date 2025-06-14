import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { City } from '../cities/city.entity';
import { Region } from '../regions/region.entity';
import { User } from 'src/users/user.entity';
import { HotelGroup } from 'src/hotel-groups/entities/hotel-group.entity';

@Entity('Hotels')
export class Hotel {
  @PrimaryGeneratedColumn()
  GlobalPropertyID: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  SourcePropertyID?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  GlobalPropertyName: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  GlobalChainCode?: string;

  @Column({ type: 'text', nullable: true })
  PropertyAddress1?: string;

  @Column({ type: 'text', nullable: true })
  PropertyAddress2?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  PrimaryAirportCode?: string;

  @Column({ type: 'int', nullable: true })
  CityID?: number;

  @ManyToOne(() => City, (city) => city.hotels, { nullable: true })
  @JoinColumn({ name: 'CityID' })
  city?: City;

  @Column({ type: 'int', nullable: true })
  PropertyStateProvinceID?: number;

  @ManyToOne(() => Region, (region) => region.hotels, { nullable: true })
  @JoinColumn({ name: 'PropertyStateProvinceID' })
  region?: Region;

  @Column({ type: 'varchar', length: 20, nullable: true })
  PropertyZipPostal?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  PropertyPhoneNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  PropertyFaxNumber?: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  SabrePropertyRating?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  PropertyLatitude?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  PropertyLongitude?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  SourceGroupCode?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column({ type: 'int', nullable: true, unique: true }) // unique
  managerId: number;

  @Column({ type: 'int', nullable: true })
  groupId?: number;

  @ManyToOne(() => HotelGroup, (group) => group.hotels)
  @JoinColumn({ name: 'groupId' })
  group?: HotelGroup;

  @ManyToOne(() => User, (user) => user.adminHotels)
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @Column({ type: 'int', nullable: true })
  adminId: number;
}
