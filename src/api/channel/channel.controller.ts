/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Channel, QueryChannel } from 'src/interface/channel.interface';

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
  @Get('findByName')
  @ApiOperation({ summary: '根据频道name查找数据' })
  public findChannelByNameFun(@Query() channelDto: QueryChannel) {
    return this.channelService.findChannelByName(
      channelDto.name,
      channelDto.page,
    );
  }
  @Get('findByContent')
  @ApiOperation({ summary: '根据输入内容查找数据' })
  public findChannelByContentFun(@Query('content') content: string) {
    return this.channelService.findChannelByContent(content);
  }
  @Get('search')
  @ApiOperation({ summary: '根据搜索输入内容查找数据/即搜索建议' })
  public searchSuggestFun(@Query('inputContent') inputContent: string) {
    return this.channelService.searchSuggest(inputContent);
  }
}
