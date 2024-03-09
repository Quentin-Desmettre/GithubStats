import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StatsRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  github_token?: string;
}
