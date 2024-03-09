import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserService } from './services/user/user.service';
import { StatsService } from './services/stats/stats.service';
import entities from './entities';
import { StatsController } from './controllers/stats/stats.controller';
import { StatsFetcherService } from './services/stats/stats-fetcher.service';
import { StatsParserService } from './services/stats/stats-parser.service';
import { StatsResponseService } from './responses/stats-response.service';
import { CalendarService } from './services/calendar/calendar.service';
import { CalendarFetcherService } from './services/calendar/calendar-fetcher.service';

import { CalendarController } from '@/controllers/calendar/calendar.controller';
import { CalendarParserService } from '@/services/calendar/calendar-parser.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [StatsController, CalendarController],
  providers: [UserService, StatsService, StatsFetcherService, StatsParserService, StatsResponseService, CalendarService, CalendarFetcherService, CalendarParserService],
})
export class AppModule {}
