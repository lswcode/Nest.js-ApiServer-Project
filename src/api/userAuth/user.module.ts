import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashPasswordMiddleware } from 'src/middleware/hash-password.middleware';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from 'src/guards/user.guard';
import { JWT_CONSTANT } from 'src/utils/jwt.constant';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/utils/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    UserService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
      // 把守卫注入到这个模块中，这样就可以在整个user模块中任意位置使用这个守卫了
    },
  ],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HashPasswordMiddleware)
      .forRoutes('user/register') // 使用中间件对密码进行加密，forRoutes确保只在user/regist这个接口中生效
      .apply(HashPasswordMiddleware)
      .forRoutes('user/change');
  }
}

// 1 中间件的模块必须实现 NestModule 接口
// 2 中间件必须使用模块类的 configure() 方法来设置
// 3 MiddlewareConsumer 是一个帮助类。它提供了几种内置方法来管理中间件，apply和forRoutes都是这个类的方法
// 4 apply()用来使用中间件，括号内参数写中间件名字，可以有多个
// 5 forRoutes用来限制中间件作用范围
