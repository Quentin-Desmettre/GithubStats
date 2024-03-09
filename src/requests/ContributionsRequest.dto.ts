import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import dates from '@/constants/dates';

export class ContributionsRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  github_token?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from: Date = new Date(dates.statsStart);

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to: Date = new Date();
}
