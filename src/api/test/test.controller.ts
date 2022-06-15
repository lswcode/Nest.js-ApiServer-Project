/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Logger } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('xb')
  public getFun() {
    Logger.log('你好小白');
    return '小白';
  }

  @Get('jsonpTest')
  public returnCallbackFun() {
    return `resCallback([
      {
        name: '测试小白',
        age: 24,
      },
      {
        name: '测试小红',
        age: 27,
      },
    ])`;
  }
  @Post('xb')
  public postFun() {
    return '小蓝';
  }
}
