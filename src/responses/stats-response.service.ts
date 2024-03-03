import { Injectable } from '@nestjs/common';
import { UserData } from '../types/stats';

@Injectable()
export class StatsResponseService {
  present(stats: UserData): string {
    return JSON.stringify(stats, undefined, 2);
  }
}
