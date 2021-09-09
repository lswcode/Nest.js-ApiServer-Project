/* eslint-disable prettier/prettier */
import { SchemaFactory } from '@nestjs/mongoose';
import { Article } from 'src/interface/article.interface';

export const ArticleSchema = SchemaFactory.createForClass(Article);
