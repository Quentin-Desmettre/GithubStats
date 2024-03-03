import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UserData } from '../types/stats';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  username: string;

  @Column({
    transformer: {
      to: (value: UserData) => {
        console.log('value', value);
        return JSON.stringify(value);
      },
      from: (value: string) => {
        return JSON.parse(value);
      },
    },
    type: 'text',
  })
  stats: {
    [dateStart: string]: {
      [dateEnd: string]: {
        updated_at: Date;
        data: UserData;
      };
    };
  };
}
