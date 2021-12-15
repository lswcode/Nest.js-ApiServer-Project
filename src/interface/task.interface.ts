/* eslint-disable prettier/prettier */
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema() // 这个是作为数据库scheam的接口，需要在db文件夹中的schema中映射
export class TaskInter extends Document {
  @Prop()
  @ApiProperty({
    description: '任务名称',
  })
  name: string;

  @Prop()
  @ApiProperty({
    description: '日期',
  })
  date: string;
  @Prop()
  @ApiProperty({
    description: '计划持续时长',
  })
  planDuration: number;
  @Prop()
  @ApiProperty({
    description: '优先等级',
  })
  priority: 'S' | 'A' | 'B' | 'C';
}
