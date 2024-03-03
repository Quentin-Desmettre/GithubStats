import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  IsDate,
} from 'class-validator';
import { SortOptions } from '../types/sortOptions';

export class StatsRequestDto {
  static readonly validSortOptions: SortOptions[] = [
    'created_at',
    'updated_at',
  ];

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @IsIn(StatsRequestDto.validSortOptions)
  sort_by?: SortOptions;

  @IsOptional()
  @IsString()
  github_token?: string;

  @IsOptional()
  @IsDate()
  since?: Date;

  @IsOptional()
  @IsDate()
  until?: Date;
}
