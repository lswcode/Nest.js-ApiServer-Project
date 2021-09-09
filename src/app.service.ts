import { Injectable } from '@nestjs/common';

@Injectable() // 使用@Injectable()修饰的就是一个服务，下面的类可以被导出到其他文件直接使用
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
