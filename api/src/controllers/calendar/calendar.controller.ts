import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserService } from '@/services/user/user.service';
import { EnvironmentVariables } from '@/types/environmentVariables';
import { CalendarService } from '@/services/calendar/calendar.service';
import { ContributionsRequestDto } from '@/requests/ContributionsRequest.dto';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getContributions(@Query() contributionsRequestDto: ContributionsRequestDto): Promise<object> {
    const user = await this.userService.findOrCreate(contributionsRequestDto.username);
    return await this.calendarService.getContributions(
      user,
      contributionsRequestDto.github_token || this.configService.get<string>('GITHUB_TOKEN'),
      contributionsRequestDto.from,
      contributionsRequestDto.to,
    );
  }
}
