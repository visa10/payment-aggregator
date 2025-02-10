import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from './entities/config.entity';
import { SetConfigDto } from './dto/set-config.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private configRepo: Repository<ConfigEntity>,
  ) {}

  // Retrieve the single global config, or create one if not exists.
  async getConfig(): Promise<ConfigEntity> {
    let config = await this.configRepo.findOne({});
    if (!config) {
      config = this.configRepo.create({ a: 0, b: 0, d: 0 });
      await this.configRepo.save(config);
    }
    return config;
  }

  async setConfig(setConfigDto: SetConfigDto): Promise<ConfigEntity> {
    const config = await this.getConfig();
    config.a = setConfigDto.a;
    config.b = setConfigDto.b;
    config.d = setConfigDto.d;
    return this.configRepo.save(config);
  }
}
