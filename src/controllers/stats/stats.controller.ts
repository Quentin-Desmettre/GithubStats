import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StatsService } from '../../services/stats/stats.service';
import { StatsRequestDto } from '../../requests/StatsRequest.dto';
import { UserService } from '../../services/user/user.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../types/environmentVariables';
import { StatsResponseService } from '../../responses/stats-response.service';

@Controller('github-stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly statsResponseService: StatsResponseService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getStats(@Query() statsRequestDto: StatsRequestDto) {
    const user = await this.userService.findOrCreate(statsRequestDto.username);
    const stats = await this.statsService.getStats(
      user,
      statsRequestDto.github_token ||
        this.configService.get<string>('GITHUB_TOKEN'),
      statsRequestDto.since,
      statsRequestDto.until,
    );

    return this.statsResponseService.present(stats);
  }
}
