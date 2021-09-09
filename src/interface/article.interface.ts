/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema() // 这个是作为数据库scheam的接口，需要在db文件夹中的schema中映射
export class Article extends Document {
  @Prop()
  @ApiProperty({
    description: '文章创建日期',
  })
  date?: string;
  @Prop()
  @ApiProperty({
    description: '文章标题',
  })
  title: string;

  @Prop()
  @ApiProperty({
    description: '文章内容',
  })
  content: string;
  @Prop()
  @ApiProperty({
    description: '管理员id', //管理员ID应该根据请求的token在后端生成
  })
  adminId?: string;
}
