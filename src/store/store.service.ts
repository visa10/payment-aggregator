import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreResponseDto } from './dto/create-store-response.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreEntity } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async createShop(
    createStoreDto: CreateStoreDto,
  ): Promise<CreateStoreResponseDto> {
    const store = this.storeRepository.create(createStoreDto);
    const newStore = await this.storeRepository.save(store);
    return { shopId: newStore.id };
  }
}
