import { SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/interface/user.interface';

export const UserSchema = SchemaFactory.createForClass(User);

// export const backstageUserSchema = SchemaFactory.createForClass(backstageUser);
//按照导入的interface接口生成schema表模板
//然后在db.module.ts中使用，创建一个Module
