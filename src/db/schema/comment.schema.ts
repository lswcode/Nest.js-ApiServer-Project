/* eslint-disable prettier/prettier */
import { SchemaFactory } from '@nestjs/mongoose';
import { Comment } from 'src/interface/comment.interface';

export const CommentSchema = SchemaFactory.createForClass(Comment);
