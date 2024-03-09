import { Injectable } from '@nestjs/common';

import { StatsFetcherService } from './stats-fetcher.service';
import { StatsParserService } from './stats-parser.service';

import { UserEntity } from '@/entities/User.entity';
import { UserData } from '@/types/stats';
import Dates from '@/constants/dates';
import { UserService } from '@/services/user/user.service';
import { asyncForEachYearBetween } from '@/utils/dates';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    private readonly statsFetcherService: StatsFetcherService,
  ) {}

  async getStats(user: UserEntity, githubToken: string): Promise<UserData> {
    if (new Date().getTime() - user.updated_at.getTime() < Dates.statsUpdateInterval) {
      return user.stats;
    }

    user.stats = await this.fetchStats(user.username, githubToken, Dates.statsStart, new Date());
    user.updated_at = new Date();
    await this.userService.save(user);
    return user.stats;
  }

  async fetchStats(username: string, githubToken: string, since: Date, until: Date): Promise<UserData> {
    const statsParser = new StatsParserService();

    await asyncForEachYearBetween(since, until, async (from, to) => {
      const stats = await this.statsFetcherService.getContributions(githubToken, username, from, to);

      if (stats === undefined) return;
      statsParser.mergeContributions(stats);
    });
    statsParser.computePercentagesAndTotal();
    return statsParser.getResult();
  }
}
