import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './api/userAuth/user.module';
import { ArticleModule } from './api/article/article.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CommentModule } from './api/comment/comment.module';
import { UserAdminModule } from './api/userAdmin/userAdmin.module';
import { ChannelModule } from './api/channel/channel.module';

@Module({
  //使用@Module修饰的就是一个模块，里面有控制器controller和服务service
  // 所有其他的Module都要导入到这，然后这个app.module被main启动，这样所有的Module都被导入main中了
  imports: [
    DbModule,
    UserModule,
    ArticleModule,
    CommentModule,
    UserAdminModule,
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth'); // 在指定接口路径中打印日志
  }
}
