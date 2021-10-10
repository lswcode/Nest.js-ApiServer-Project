import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { responseInterface } from 'src/interface/response.interface';
import { User } from 'src/interface/user.interface';
@Injectable()
export class UserAdminService {
  private response: responseInterface;
  private pageSize = 6; //设置每页条数
  private pageCount: number; //总页数，返回给前端，让前端设置分页条数
  constructor(
    @InjectModel('USER_MODEL') private readonly UserModel: Model<User>,
  ) {}

  // -------------------------------查找指定页码，并返回指定条数用户信息的接口---------------------------------------------------------------------------
  public async findUserByPage(page) {
    try {
      const dataNum = (await this.UserModel.find()).length; // 先计算所有数据的总条数，返回给前端计算分页的总页数
      // 和前端约定好一页的数量，就可以根据前端请求的页码请求指定位置的数据
      const data = await this.UserModel.find()
        .sort({ _id: -1 })
        .skip(page > 1 ? (page - 1) * this.pageSize : 0)
        // skip()方法用来跳过指定数量的数据
        .limit(this.pageSize);
      // limit()方法指定返回的数据数量
      this.pageCount = Math.ceil(dataNum / this.pageSize);
      // Math.ceil取整函数，对数字向上取整
      this.response = {
        code: 1,
        msg: '获取用户数据成功',
        data,
        pageSize: this.pageSize, // 每页条数
        pageCount: this.pageCount, // 总页数
        dataNum, // 总数据条数
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取用户数据失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }

  // -------------------------------根据用户名返回指定用户---------------------------------------------------------------------------
  public async findUserByUserName(userName) {
    try {
      const data: any = await this.UserModel.findOne({
        userName,
      });
      if (data) {
        this.response = {
          code: 1,
          msg: '获取用户数据成功',
          data,
          dataNum: 1, // 总数据条数
        };
      } else {
        this.response = {
          code: 0,
          msg: '用户不存在',
          data,
          dataNum: 0, // 总数据条数
        };
      }
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取用户数据失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // ---------------------------------根据用户id查找用户-----------------------------------------------------------------
  public async findUserById(_id) {
    try {
      const data: any = await this.UserModel.findById(_id);
      if (data) {
        this.response = {
          code: 1,
          msg: '获取用户数据成功',
          data,
          dataNum: 1, // 总数据条数
        };
      } else {
        this.response = {
          code: 0,
          msg: '用户不存在',
          data,
          dataNum: 0, // 总数据条数
        };
      }
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取用户数据失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // -------------------------------删除用户接口-------------------------------------------------------------------------
  public async delUser(UserId: string) {
    try {
      const data = await this.UserModel.findByIdAndDelete(UserId);
      // 如果ID正确，data存在则执行下面代码，ID不存在则会报错，去执行catch中的代码
      this.response = {
        code: 1,
        msg: '用户删除成功',
        data: data._id,
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '用户删除失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
}
