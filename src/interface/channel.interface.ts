/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema() // 这个是作为数据库scheam的接口，需要在db文件夹中的schema中映射
export class Channel extends Document {
  @Prop()
  @ApiProperty({
    description: '数据创建日期',
  })
  date?: string;
  @Prop()
  @ApiProperty({
    description: '频道name',
  })
  name: string;

  @Prop()
  @ApiProperty({
    description: '数据内容',
  })
  content: string;
}
