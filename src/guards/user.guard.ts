import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  // reflector是nest定义的一个方法，用get读取到SetMetadata设置的守卫权限
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // 如果roles不存在，说明这个请求没有设置SetMetadata权限，即直接放行
      return true;
    }
    // const request = context.switchToHttp().getRequest();
    return true;
  }
}

// 每个守卫必须实现一个canActivate()函数，这个函数必须返回一个布尔值，判断是否允许当前请求
// 如果返回 true，将处理用户请求
// 如果返回 false，则 Nest 将忽略该请求，会返回403报错
