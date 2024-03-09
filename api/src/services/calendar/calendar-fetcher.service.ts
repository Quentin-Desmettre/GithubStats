import { Injectable } from '@nestjs/common';

import { CalendarData, RawCalendarAnswer } from '@/types/calendar';

@Injectable()
export class CalendarFetcherService {
  async getRawCalendar(token: string, username: string, from: Date, to: Date): Promise<RawCalendarAnswer> {
    const headers = {
      Authorization: `bearer ${token}`,
    };
    const body = {
      query: `query {
        user(login: "${username}") {
          contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }`,
    };
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    });
    return await response.json();
  }

  async getContributions(token: string, username: string, from: Date, to: Date): Promise<CalendarData | undefined> {
    const parsed = await this.getRawCalendar(token, username, from, to);

    if (parsed.data === undefined || parsed.data.user === undefined) {
      return undefined;
    }
    return {
      ...parsed.data.user.contributionsCollection.contributionCalendar,
    };
  }
}
