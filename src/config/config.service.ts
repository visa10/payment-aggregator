import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './entities/config.entity';
import { SetConfigDto } from './dto/set-config.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
  ) {}

  // Retrieve the single global config, or create one if not exists.
  async getConfig(): Promise<Config> {
    let config = await this.configRepository.findOne({
      where: { name: 'storeCommission' },
    });

    if (!config) {
      config = this.configRepository.create({
        name: 'storeCommission',
        a: 0,
        b: 0,
        d: 0,
      });
      await this.configRepository.save(config);
    }
    return config;
  }

  async setConfig(setConfigDto: SetConfigDto): Promise<Config> {
    const config = await this.getConfig();
    config.a = setConfigDto.a;
    config.b = setConfigDto.b;
    config.d = setConfigDto.d;
    return this.configRepository.save(config);
  }
}
