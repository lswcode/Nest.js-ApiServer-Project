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
    // 使用构造函数和@InjectModel装饰器将USER模型注入到UserService中:
    @InjectModel('USER_MODEL') private readonly UserModel: Model<User>, // 注册声明一个属性UserModel，就是一个数据库Model，后面是类型注解
    private readonly jwtService: JwtService, //用来生成token
  ) {}
  // ---------------------------工具方法-----------------------------------------------------------
  // 注册接口方法，public公共方法，可以被任意调用
  private createToken(userId) {
    const token = this.jwtService.sign({ id: String(userId) }); // sign的参数必须是对象，键值对格式
    return token; // 使用jwt内置的方法根据user生成指定的token
  }
  // 把通过账号查找用户方法封装起来，在别的地方也可以用
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
    console.log('执行注册');

    try {
      const userName = await this.findOneByUserName(user.userName);
      const account = await this.findOneByAccount(user.account);
      if (userName) {
        this.response = {
          code: 0,
          msg: '该用户名已被注册',
        };
        throw this.response; // 抛出异常后,后面的代码无法执行,catch中会接受这个异常，也就是抛出的this.response
      } else if (account) {
        this.response = {
          code: 0,
          msg: '该账号已被注册',
        };
      } else {
        try {
          const createUser = new this.UserModel(user); // 实例化一个数据库Module模型，即创建一个文档数据
          createUser.date = createUser._id.getTimestamp().toLocaleDateString();
          // xxx._id.getTimestamp()可以获取创建时间，这是mongoose的方法   // toLocaleDateString()是格式化时间，转换成2021/10/11 的格式，没有小时和分钟
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

  // ---将返回给前端的数据处理相关代码，封装成一个函数----------------------------------------------------------
  public responseHandle(code, msg, obj?) {
    this.response = {
      code,
      msg,
    };
    if (!obj) {
      return this.response;
    }
    const keyArr = Object.keys(obj); // 如果还存在其它的参数，需要遍历获取键名和键值，赋值给this.response
    keyArr.map((item) => {
      this.response[item] = obj[item];
    });
    return this.response;
  }

  // -----------------------用户登录方法--------------------------------------------
  public async login(user: UserAuth, backstageAuth = false) {
    // 当backstageAuth的值为true时，则表示后台管理员登录，需要判断权限
    // 用户数据下的backstageAuth == 'admin'才可以登录
    console.log(user, user.account, user.password);
    const account: string = user.account;
    const password: string = user.password;
    try {
      if (!(account && password)) {
        return this.responseHandle(10001, '请求参数错误!'); // 将重复的代码抽离，封装成一个处理函数，直接调用即可
      }

      const res = await this.findOneByAccount(account);
      if (!res) {
        return this.responseHandle(10002, '用户不存在');
      } else {
        const saltPassword = encript(password, res.salt);
        // 将当前未知是否正确的密码，和该用户名对应的salt传入函数，得到salt加密后的密码
        // 将加密后的密码和正确的加密密码比较
        console.log(saltPassword);
        if (!backstageAuth) {
          if (saltPassword == res.password) {
            const token: string = this.createToken(res._id);
            this.responseHandle(1, '登陆成功', {
              userId: res._id,
              token: token,
            });
            // this.response = {
            //   code: 1,
            //   msg: '登陆成功',
            //   userId: res._id, // 登录成功时，则把用户数据库id和token都返回给前端
            //   token,
            // };
          } else {
            this.response = this.responseHandle(2, '账号或密码不正确');
          }
        } else {
          if (res.backstageAuth == 'admin') {
            if (saltPassword == res.password) {
              const token: string = this.createToken(res._id);
              this.responseHandle(1, '登陆成功', {
                userId: res._id,
                token: token,
              });
            } else {
              this.response = this.responseHandle(2, '账号或密码不正确');
            }
          } else {
            this.response = this.responseHandle(2, '账号权限不足');
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
          // 这个mongoose的查询方法
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
