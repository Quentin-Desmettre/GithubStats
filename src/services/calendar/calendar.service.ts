import { Injectable } from '@nestjs/common';

import { UserService } from '@/services/user/user.service';
import { CalendarFetcherService } from '@/services/calendar/calendar-fetcher.service';
import { UserEntity } from '@/entities/User.entity';
import { CalendarParserService } from '@/services/calendar/calendar-parser.service';
import { asyncForEachYearBetween } from '@/utils/dates';
import { Calendar, CalendarData } from '@/types/calendar';
import Dates from '@/constants/dates';

@Injectable()
export class CalendarService {
  constructor(
    private readonly userService: UserService,
    private readonly calendarFetcherService: CalendarFetcherService,
    private readonly calendarParserService: CalendarParserService,
  ) {}

  async getContributions(user: UserEntity, githubToken: string, from: Date, to: Date): Promise<Calendar> {
    if (new Date().getTime() - user.contributions_updated_at.getTime() < Dates.statsUpdateInterval) {
      return user.contributions;
    }

    const presented = await this.getPresentedContributions(user, githubToken, from, to);
    user.contributions = presented;
    user.contributions_updated_at = new Date();
    await this.userService.save(user);
    return presented;
  }

  async getPresentedContributions(user: UserEntity, githubToken: string, from: Date, to: Date): Promise<Calendar> {
    const totalContributions: CalendarData[] = [];

    await asyncForEachYearBetween(from, to, async (from, to) => {
      const contributions = await this.calendarFetcherService.getContributions(githubToken, user.username, from, to);
      if (contributions === undefined) return;

      totalContributions.push(contributions);
    });

    return this.calendarParserService.presentContributions(totalContributions);
  }
}
