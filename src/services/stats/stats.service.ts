import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities/User.entity';
import { UserData } from '../../types/stats';
import Dates from '../../constants/dates';
import { UserService } from '../user/user.service';
import { StatsFetcherService } from './stats-fetcher.service';
import { StatsParserService } from './stats-parser.service';
import { asyncForEachYearBetween } from '../../utils/dates';
import stats from '../../constants/stats';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    private readonly statsFetcherService: StatsFetcherService,
  ) {}

  getLastRefreshDateOrCreate(
    user: UserEntity,
    sinceDate: Date,
    untilDate: Date,
  ): Date {
    const since = sinceDate.toDateString();
    const until = untilDate.toDateString();
    const statsSince = user.stats[since];
    const statsUntil = statsSince?.[until];

    if (statsUntil !== undefined) return statsUntil.updated_at;
    if (statsSince === undefined) user.stats[since] = {};
    user.stats[since][until] = {
      updated_at: new Date(),
      data: stats.defaultStats,
    };
    return new Date();
  }

  async getStats(
    user: UserEntity,
    githubToken: string,
    sinceDate: Date | undefined,
    untilDate: Date | undefined,
  ): Promise<UserData> {
    if (sinceDate === undefined) sinceDate = Dates.statsStart;
    if (untilDate === undefined) untilDate = new Date();

    const since = sinceDate.toDateString();
    const until = untilDate.toDateString();
    this.getLastRefreshDateOrCreate(user, sinceDate, untilDate);
    // if (refreshDate && new Date().getTime() - refreshDate.getTime() < Refresh.refreshDelay) {
    //   console.log('Using cached stats');
    //   return user.stats[since][until].data;
    // }

    const userStats = user.stats[since][until];
    userStats.data = await this.fetchStats(
      user.username,
      githubToken,
      sinceDate,
      untilDate,
    );
    userStats.updated_at = new Date();
    user.stats[since][until] = userStats;
    await this.userService.save(user);
    return userStats.data;
  }

  async fetchStats(
    username: string,
    githubToken: string,
    since: Date,
    until: Date,
  ): Promise<UserData> {
    const statsParser = new StatsParserService();

    await asyncForEachYearBetween(since, until, async (from, to) => {
      const stats = await this.statsFetcherService.getContributions(
        githubToken,
        username,
        from,
        to,
      );

      if (stats === undefined) return;
      statsParser.mergeContributions(stats);
    });
    statsParser.computePercentagesAndTotal();
    return statsParser.getResult();
  }
}
