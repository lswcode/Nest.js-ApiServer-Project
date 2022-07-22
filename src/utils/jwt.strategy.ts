/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_CONSTANT } from './jwt.constant';
import { User } from 'src/interface/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('USER_MODEL') private readonly UserModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 用来从请求中提取token的方法
      ignoreExpiration: false, // 如果提供了一个过期的token，请求将被拒绝
      secretOrKey: JWT_CONSTANT.secret,
    });
  }

  // Passport首先验证token并解码，然后调用validate()方法，参数是解码后的对象，也就是创建token时sign中的参数对象
  async validate(tokenObj) {
    // 每次携带token的请求，验证token时都会执行这里
    const user = await this.UserModel.findById(tokenObj.id); //生成token时是使用用户数据库id生成的，所以解密出的数据中就有这个id
    // 根据用户id查找到用户并返回给req对象，所有开启了@UseGuards(AuthGuard('jwt'))验证的请求都可以使用req.user来获取用户信息
    console.log('中间件打印用户数据', user);
    return user; // 返回根据ID查询到的用户，也可以直接返回ID,注意: 这个返回的值必须通过req.user获取，user是规定好的，这里不管返回时名字叫什么，最终在req获取时必须是req.user
    // Passport将会把validate()方法的返回值，构建成一个user对象，并将其作为属性附加到req请求对象上
    // 即我们可以在controller的@Req()请求对象中获取到这里返回的值，使用req.user获取
  }
}
