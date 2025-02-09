import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreResponseDto {
  @ApiProperty({ description: 'New shop ID' })
  shopId: number;
}
