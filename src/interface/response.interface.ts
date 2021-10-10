/* eslint-disable prettier/prettier */
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

// 在定义全局使用的接口

export interface responseInterface {
  code: number; // 1:注册成功 0:注册失败，账号已被注册  2:出现未知错误
  msg: unknown;
  [propname: string]: any; // 其它任意值
}

export class commentDto extends Document {
  @Prop()
  @ApiProperty({
    description: '评论的文章id',
  })
  articleId: string;

  @Prop()
  @ApiProperty({
    description: '评论页码',
  })
  page: number;
}
