import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@/entities/User.entity';
import stats from '@/constants/stats';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async create(username: string): Promise<UserEntity> {
    const user: UserEntity = {
      username,
      stats: stats.defaultStats,
      updated_at: new Date(1970, 0),
      contributions_updated_at: new Date(1970, 0),
      contributions: {
        totalContributions: 0,
        contributions: {},
      },
    };
    return this.save(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOrCreate(username: string): Promise<UserEntity> {
    const user = await this.findByUsername(username);
    if (user) {
      return user;
    }
    return this.create(username);
  }
}
