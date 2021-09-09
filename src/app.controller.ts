import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 使用@Controller修饰的就是一个控制器
export class AppController {
  // 控制器注入需要使用的服务: 在构造函数中初始化 服务的名称:导入的服务类名，private readonly表示私有的只读属性
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// 这是class AppController是一个类，在nest中会自动注入类，不需要使用new实例化对象
