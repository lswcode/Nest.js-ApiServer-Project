import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; // 导入InjectModel
import { responseInterface } from 'src/interface/response.interface';
import { User, UserAuth, UserInfo } from 'src/interface/user.interface';
import { encript } from 'src/utils/crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private response: responseInterface;
  constructor(
    @InjectModel('USER_MODEL') private readonly UserModel: Model<User>,
    private readonly jwtService: JwtService, //用来生成token
  ) {}
  // ---------------------------工具方法-----------------------------------------------------------
  private createToken(userId) {
    const token = this.jwtService.sign({ id: String(userId) }); // sign的参数必须是对象，键值对格式
    return token; // 使用jwt内置的方法根据user生成指定的token
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
          createUser.date = createUser._id.getTimestamp().toLocaleDateString();
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
  public async login(user: UserAuth, backstageAuth = false) {
    // 当backstageAuth的值为true时，则表示后台管理员登录，需要判断权限
    // 用户数据下的backstageAuth == 'admin'才可以登录
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
        if (!backstageAuth) {
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
        } else {
          if (res.backstageAuth == 'admin') {
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
          } else {
            this.response = {
              code: 2,
              msg: '账号权限不足',
            };
          }
        }
      }
    } catch (err) {
      return err;
    } finally {
      return this.response;
    }
  }

  // -----------------------用户修改密码方法，暂时只支持管理员直接修改--------------------------------------------------------------------------------
  // 传入账号和密码，中间件会加上原始密码，最终一起存入，密码和原始密码会被修改，账号和用户名会保持不变，并不会被影响
  // 只会修改当前user中存在的值，数据库中存在，当前user中不存在，则被不会影响
  public async changePsaaword(user: User) {
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

  // -----------------------用户个人信息添加和修改--------------------------------------------------------------------------------

  public async userInfor(userId: string, information: UserInfo) {
    console.log(userId);
    try {
      const account = await this.UserModel.findById(userId);
      console.log(account);
      if (!account) {
        this.response = {
          code: 0,
          msg: '该账号不存在',
        };
      } else {
        await this.UserModel.findOneAndUpdate(
          { _id: userId },
          information, // 直接把键值对的对象存入即可，当这个数据库数据中不存在这些键值对时就会添加，存在时，就会修改，不会影响数据中本身存在的其他内容，例如账号等
          {},
          () => {
            Logger.log(`用户ID${userId}修改个人信息成功`);
          },
        );
        this.response = {
          code: 1,
          msg: '修改个人信息成功',
        };
      }
    } catch (err) {
      this.response = {
        code: 2,
        msg: `出现catch错误${err}`,
      };
      console.warn('userInfor方法处理失败', err);
    } finally {
      return this.response;
    }
  }
}
