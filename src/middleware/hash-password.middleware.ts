import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { addSalt, encript } from 'src/utils/crypto';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let userPassword = req.body['password']; // 这里不能使用.来访问，只是使用中括号,因为req中类型注解中没有password，使用中括号则没有限制，即使不存在这个变量
    if (userPassword) {
      req.body['originalPassword'] = userPassword; // 在这存入用户初始密码，实际中为了用户安全不应该把这个密码暴露
      const salt = addSalt();
      userPassword = encript(userPassword, salt); // 将密码和生成的salt盐传入函数，生成一个加密的密码
      req.body['password'] = userPassword; // 如果req请求中存在password，则把password修改为加密后的密码，即用户注册时就会自动把密码加密
      req.body['salt'] = salt;
      // 把加密算法的盐也传入req，只有使用原始密码和对应的salt传入encript，才能得到存入数据库的正确密码
    }
    next(); // 中间件最后必须写上next，表示进入下一个处理步骤
  }
}
