/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
const obj = [
  {
    name: '测试小白',
    age: 24,
  },
  {
    name: '测试小红',
    age: 27,
  },
];
@Controller('test')
export class TestController {
  @Get('xb')
  public getFun() {
    return [
      {
        name: '测试小白',
        age: 24,
      },
      {
        name: '测试小红',
        age: 27,
      },
    ];
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
}
