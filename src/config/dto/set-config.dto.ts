import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetConfigDto {
  @ApiProperty({ description: 'Fixed commission A (in monetary units)' })
  @Min(0)
  @IsNumber()
  a: number;

  @ApiProperty({ description: 'Percentage commission B (e.g. 2.5 means 2.5%)' })
  @Min(0)
  @Max(10)
  @IsNumber()
  b: number;

  @ApiProperty({ description: 'Temporary hold percentage D (e.g. 5 means 5%)' })
  @Min(0)
  @Max(100)
  @IsNumber()
  d: number;
}
