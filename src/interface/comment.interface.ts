/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop()
  @ApiProperty({
    description: '评论id',
  })
  commentId?: string;

  @Prop()
  @ApiProperty({
    description: '用户名',
  })
  userName?: string;

  @Prop()
  @ApiProperty({
    description: '评论创建日期',
  })
  date?: string;

  @Prop()
  @ApiProperty({
    description: '评论的文章标题',
  })
  title: string;

  @Prop()
  @ApiProperty({
    description: '评论内容',
  })
  content: string;

  @Prop()
  @ApiProperty({
    description: '评论是否显示',
  })
  show: boolean; // 默认传入都是true，只有在后台修改的情况下会变成false，即隐藏，查询评论时会忽略false的评论
}
