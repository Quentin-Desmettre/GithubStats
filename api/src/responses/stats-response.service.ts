import { Injectable } from '@nestjs/common';

import { UserData } from '@/types/stats';
import { UserEntity } from '@/entities/User.entity';

@Injectable()
export class StatsResponseService {
  present(stats: UserData, user: UserEntity): object {
    return {
      updated_at: user.updated_at,
      ...stats,
    };
  }
}
