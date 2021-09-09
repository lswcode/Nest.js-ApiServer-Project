import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/http-exception.filter';

const port = 3000;
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  // --------------------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('myBlog项目管理平台')
    .setDescription('接口文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-ui', app, document);

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter()); // 对返回给前端的报错进行统一处理，加上日期和请求的路径
  // ------------------------------------------------
  // app.enableCors(); // 设置允许跨域
  await app.listen(port);
};

bootstrap().then(() => {
  Logger.log(`开始监听端口:http://localhost:${port}/api-ui`);
});
