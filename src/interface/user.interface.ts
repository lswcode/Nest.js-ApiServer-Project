import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  @ApiProperty({
    description: '用户名',
  })
  userName: string;

  @Prop()
  @ApiProperty({
    description: '账号',
  })
  account: string;

  @Prop()
  @ApiProperty({
    description: '密码',
  })
  password: string;
  @Prop()
  readonly salt?: string;
}
export class UserAuth extends Document {
  @Prop()
  @ApiProperty({
    description: '账号',
  })
  account: string;

  @Prop()
  @ApiProperty({
    description: '密码',
  })
  password: string;
}
