import { Body, Controller, HttpCode, Post, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateStoreResponseDto } from './dto/create-store-response.dto';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shop.' })
  @ApiResponse({
    status: 201,
    description: 'Shop created successfully.',
    type: CreateStoreResponseDto,
  })
  async createShop(
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<CreateStoreResponseDto> {
    return this.storeService.createShop(createStoreDto);
  }
}
