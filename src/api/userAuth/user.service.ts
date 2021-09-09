import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; // 导入InjectModel
import { responseInterface } from 'src/interface/response.interface';
import { User, UserAuth } from 'src/interface/user.interface';
import { encript } from 'src/utils/crypto';
import { JwtService } from '@nestjs/jwt';
import { loginInterface } from 'src/interface/login.interface';

@Injectable()
export class UserService {
  private response: responseInterface;
  constructor(
    @InjectModel('USER_MODEL') private readonly UserModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  // ---------------------------工具方法-----------------------------------------------------------
  private createToken(userId) {
    const token = this.jwtService.sign({ id: String(userId) }); // sign的参数必须是对象，键值对格式
    return token; // 使用jwt内置的方法根据user生成指定的token
  }
  public async login(user: UserAuth) {
    return await this.validateUser(user);
  }
  public async findOneByAccount(account: string) {
    return this.UserModel.findOne({
      account,
    });
  }
  public async findOneByUserName(userName: string) {
    return this.UserModel.findOne({
      userName,
    });
  }
  // ------------------------用户注册方法---------------------------------------------------------
  public async regist(user: User) {
    try {
      const userName = await this.findOneByUserName(user.userName);
      const account = await this.findOneByAccount(user.account);
      if (userName) {
        this.response = {
          code: 0,
          msg: '该用户名已被注册',
        };
        throw this.response;
      } else if (account) {
        this.response = {
          code: 0,
          msg: '该账号已被注册',
        };
      } else {
        try {
          const createUser = new this.UserModel(user); // 实例化一个数据库Module模型，即创建一个文档数据
          await createUser.save();
          this.response = {
            code: 1,
            msg: `注册成功`,
          };
        } catch (err) {
          this.response = {
            code: 2,
            msg: `出现未知错误${err}`,
          };
          throw this.response;
        }
      }
    } catch (err) {
      Logger.log(`regist方法出错--${user.account}-${err.msg}`);
    } finally {
      return this.response;
    }
  }

  // -----------------------用户登录方法--------------------------------------------
  private async validateUser(user: UserAuth) {
    const account: string = user.account;
    const password: string = user.password;
    try {
      const res = await this.findOneByAccount(account);
      if (!res) {
        this.response = {
          code: 0,
          msg: '用户不存在',
        };
      } else {
        const saltPassword = encript(password, res.salt);
        if (saltPassword == res.password) {
          const token: string = this.createToken(res._id);
          this.response = {
            code: 1,
            msg: '登陆成功',
            userId: res._id,
            token, //将token返回给前端
          };
        } else {
          this.response = {
            code: 2,
            msg: '账号或密码不正确',
          };
        }
      }
    } catch (err) {
      return err;
    } finally {
      return this.response;
    }
  }

  // -----------------------用户修改密码方法，暂时只支持管理员直接修改--------------------------------------------------------------------------------

  public async changePsaaword(user: UserAuth) {
    try {
      const account = await this.findOneByAccount(user.account);
      console.log(account);
      if (!account) {
        this.response = {
          code: 0,
          msg: '该账号不存在',
        };
      } else {
        await this.UserModel.findOneAndUpdate(
          { account: user.account },
          user,
          {},
          () => {
            Logger.log(`用户${user.account}修改密码成功`);
          },
        );
        this.response = {
          code: 1,
          msg: '修改密码成功',
        };
      }
    } catch (err) {
      this.response = {
        code: 2,
        msg: `出现catch错误${err}`,
      };
      console.warn('changePsaaword方法处理失败', err);
    } finally {
      return this.response;
    }
  }
}
