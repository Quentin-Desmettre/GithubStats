import { Column, Entity, PrimaryColumn } from 'typeorm';

import { UserData } from '@/types/stats';
import { Calendar } from '@/types/calendar';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  username: string;

  @Column({
    transformer: {
      to: (value: UserData) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value),
    },
    type: 'text',
  })
  stats: UserData;

  @Column()
  updated_at: Date;

  @Column()
  contributions_updated_at: Date;

  @Column({
    transformer: {
      to: (value: Calendar) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value),
    },
    type: 'text',
  })
  contributions: Calendar;
}
