import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('get')
  public getFun() {
    return {
      name: '测试小白',
      age: 24,
    };
  }
}
