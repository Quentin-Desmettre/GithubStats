import { Injectable } from '@nestjs/common';

import { Calendar, CalendarData } from '@/types/calendar';

@Injectable()
export class CalendarParserService {
  presentContributions(contributions: CalendarData[]): Calendar {
    const baseCalendar: Calendar = { contributions: {} };

    contributions.forEach(year => {
      year.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          baseCalendar.contributions[new Date(day.date).getTime()] = day.contributionCount;
        });
      });
    });

    const sortedCalendarKeys = Object.keys(baseCalendar.contributions).sort((a, b) => parseInt(a) - parseInt(b));
    const sortedCalendar: Calendar = { contributions: {} };
    sortedCalendarKeys.forEach(key => {
      sortedCalendar.contributions[new Date(parseInt(key)).toDateString()] = baseCalendar.contributions[key];
    });
    return sortedCalendar;
  }
}
