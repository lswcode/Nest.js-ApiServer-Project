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
    },
  ],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HashPasswordMiddleware)
      .forRoutes('user/regist') // 限制这个密码加密中间件只在注册和更改密码请求中生效
      .apply(HashPasswordMiddleware)
      .forRoutes('user/change');
  }
}
