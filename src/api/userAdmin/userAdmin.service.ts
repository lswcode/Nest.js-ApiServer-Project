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
      const dataNum = (await this.UserModel.find()).length;
      // 和前端约定好一页的数量，就可以根据前端请求的页码请求指定位置的数据
      const data = await this.UserModel.find()
        .skip(page > 1 ? (page - 1) * this.pageSize : 0)
        .limit(this.pageSize);
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
      const data = await this.UserModel.findOne({
        userName,
      });
      if (data) {
        this.response = {
          code: 1,
          msg: '获取用户数据成功',
          data: [data],
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
}
