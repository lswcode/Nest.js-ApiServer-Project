/* eslint-disable prettier/prettier */
import { SchemaFactory } from '@nestjs/mongoose';
import { TaskInter } from 'src/interface/task.interface';

export const TaskSchema = SchemaFactory.createForClass(TaskInter);
