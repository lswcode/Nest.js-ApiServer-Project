/* eslint-disable prettier/prettier */
import { SchemaFactory } from '@nestjs/mongoose';
import { Channel } from 'src/interface/channel.interface';

export const ChannelSchema = SchemaFactory.createForClass(Channel);
