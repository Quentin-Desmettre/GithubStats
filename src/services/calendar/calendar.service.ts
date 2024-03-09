import { Injectable } from '@nestjs/common';

import { UserService } from '@/services/user/user.service';
import { CalendarFetcherService } from '@/services/calendar/calendar-fetcher.service';
import { UserEntity } from '@/entities/User.entity';
import { CalendarParserService } from '@/services/calendar/calendar-parser.service';
import { asyncForEachYearBetween } from '@/utils/dates';
import { CalendarData } from '@/types/calendar';

@Injectable()
export class CalendarService {
  constructor(
    private readonly userService: UserService,
    private readonly calendarFetcherService: CalendarFetcherService,
    private readonly calendarParserService: CalendarParserService,
  ) {}

  async getContributions(user: UserEntity, githubToken: string, from: Date, to: Date): Promise<object> {
    const totalContributions: CalendarData[] = [];

    await asyncForEachYearBetween(from, to, async (from, to) => {
      const contributions = await this.calendarFetcherService.getContributions(githubToken, user.username, from, to);
      if (contributions === undefined) return;

      totalContributions.push(contributions);
    });

    return this.calendarParserService.presentContributions(totalContributions);
  }
}
