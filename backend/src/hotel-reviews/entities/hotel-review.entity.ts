import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Hotel } from 'src/hotels/hotel.entity';
import { User } from 'src/users/user.entity';

@Entity('Hotel_Reviews')
export class HotelReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  score: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  stay_date: string;

  @Column({ type: 'text', nullable: true })
  positive: string;

  @Column({ type: 'text', nullable: true })
  negative: string;

  @Column({ type: 'int', nullable: true })
  hotel_id: number;

  @ManyToOne(() => Hotel, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'float', nullable: true })
  cleanliness_text: number;

  @Column({ type: 'float', nullable: true })
  food_text: number;

  @Column({ type: 'float', nullable: true })
  sleep_text: number;

  @Column({ type: 'float', nullable: true })
  internet_text: number;

  @Column({ type: 'float', nullable: true })
  amenities_text: number;

}
