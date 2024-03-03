import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/User.entity';
import { Repository } from 'typeorm';

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
    const user = new UserEntity();
    user.username = username;
    user.stats = {};
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
