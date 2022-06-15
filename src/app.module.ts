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
import { TestModule } from './api/test/test.module';
import { Log4jsModule } from '@nestx-log4js/core';
import { TaskModule } from './api/task/task.module';

@Module({
  imports: [
    DbModule,
    UserModule,
    ArticleModule,
    CommentModule,
    UserAdminModule,
    ChannelModule,
    TestModule,
    TaskModule,
    Log4jsModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth'); // 在指定接口路径中打印日志
  }
}
