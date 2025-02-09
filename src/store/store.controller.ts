import { Body, Controller, HttpCode, Post, HttpStatus } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateStoreResponseDto } from './dto/create-store-response.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createShop(
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<CreateStoreResponseDto> {
    return this.storeService.createShop(createStoreDto);
  }
}
