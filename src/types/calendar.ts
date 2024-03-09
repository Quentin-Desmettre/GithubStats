export type RawCalendarAnswer = {
  data:
    | {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
              weeks: {
                contributionDays: {
                  contributionCount: number;
                  date: string;
                }[];
              }[];
            };
          };
        };
      }
    | undefined;
};

export type CalendarData = {
  totalContributions: number;
  weeks: {
    contributionDays: {
      contributionCount: number;
      date: string;
    }[];
  }[];
};

export type Calendar = {
  contributions: {
    [key: string]: number;
  };
};
