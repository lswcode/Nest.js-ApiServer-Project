import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './schema/article.schema';
import { ChannelSchema } from './schema/channel.schema';
import { CommentSchema } from './schema/comment.schema';
import { UserSchema } from './schema/user.schema';

// MongooseModule提供了forFeature()方法来配置模块，定义哪些Model模型应该注册在当前数据库范围中
// 如果你还想在另外的模块中使用这个Model模型，将MongooseModule添加到exports部分并在其他模块中导入，即可使用
// 所以如果添加新的Model模型就在这里注册，需要写好模型名，导入模板schema和写好集合名
const MONGO_MODELS = MongooseModule.forFeature([
  { name: 'USER_MODEL', schema: UserSchema, collection: 'users' },
  // {
  //   name: 'BACKSTAGE_USER_MODEL',
  //   schema: backstageUserSchema,
  //   collection: 'backstageUsers',
  // },
  { name: 'ARTICLE_MODEL', schema: ArticleSchema, collection: 'articles' },
  { name: 'COMMENT_MODEL', schema: CommentSchema, collection: 'comments' },
  { name: 'CHANNEL_MODEL', schema: ChannelSchema, collection: 'channels' },
]);

@Global() // 标记为数据库为全局模块，因为别的模块中经常使用，使用
@Module({
  imports: [
    // 连接数据库，MongooseModule.forRoot的参数和mongoose.connect()一样
    MongooseModule.forRoot('mongodb://localhost/nest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    MONGO_MODELS,
  ],
  exports: [MONGO_MODELS], // 导出，让其他文件也可以使用
})
export class DbModule {}
