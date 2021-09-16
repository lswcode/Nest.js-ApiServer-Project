import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  backstageAuth?: string;

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
  date?: string; // 用户创建日期

  @Prop()
  contact?: string; // 用户联系方式

  @Prop()
  profileImg?: string; // 用户头像

  @Prop()
  readonly salt?: string; //密码加盐

  @Prop()
  originalPassword?: string; //密码加盐
}
// ---------------------用户验证口----------------------------------------------------
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
// --------------------用户个人信息接口----------------------------------------------
export class UserInfo extends Document {
  @Prop()
  @ApiProperty({
    description: '用户名',
  })
  userName?: string;

  @Prop()
  @ApiProperty({
    description: '用户联系方式',
  })
  contact: string;

  @Prop()
  @ApiProperty({
    description: '用户头像',
  })
  profileImg: string;
}
// ------------------------------------------------------------------
