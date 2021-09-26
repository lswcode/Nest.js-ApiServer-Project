import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChannelService } from './channel.service';
import { Channel } from 'src/interface/channel.interface';

@Controller('channel')
@ApiTags('频道内容API')
@ApiBearerAuth('jwt')
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '创建频道' })
  public addchannel(@Body() channel: Channel) {
    return this.channelService.createChannel(channel);
  }
  @Get('channelName')
  @ApiOperation({ summary: '返回频道名称' })
  public channelNameFun() {
    return this.channelService.channelName();
  }
  @Get('find')
  @ApiOperation({ summary: '根据频道name查找数据' })
  public findChannelByNameFun(@Query() channelDto) {
    return this.channelService.findChannelByName(
      channelDto.name,
      channelDto.page,
    );
  }
}
