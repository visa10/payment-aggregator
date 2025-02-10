import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { SetConfigDto } from './dto/set-config.dto';
import { ConfigEntity } from './entities/config.entity';

@ApiTags('Config')
@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Post()
  @ApiOperation({ summary: 'Set system commissions and temporary hold.' })
  @ApiResponse({ status: 200, description: 'Config updated successfully.' })
  async setConfig(
    @Body() setConfigDto: SetConfigDto,
  ): Promise<{ message: string; config: ConfigEntity }> {
    const config = await this.configService.setConfig(setConfigDto);
    return { message: 'Config updated successfully', config };
  }
}
