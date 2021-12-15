import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { responseInterface } from 'src/interface/response.interface';
import { Channel } from 'src/interface/channel.interface';

@Injectable()
export class ChannelService {
  private response: responseInterface;
  private pageSize = 6; //设置每页条数

  constructor(
    @InjectModel('CHANNEL_MODEL') private readonly ChannelModel: Model<Channel>,
  ) {}

  // -----------------------------创建频道内容接口------------------------------------------------------
  public async createChannel(channel: Channel) {
    const createchannel = new this.ChannelModel(channel);
    createchannel.date = createchannel._id.getTimestamp().toLocaleDateString(); // 格式化创建文件的时间
    try {
      const data = await createchannel.save();
      this.response = {
        code: 1,
        msg: '频道数据创建成功',
        id: data._id,
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '频道数据创建失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // -----------获取频道名称接口------------------------------------------------------------------------
  public async channelName() {
    try {
      const data: any = await this.ChannelModel.find().distinct('name');
      if (data) {
        this.response = {
          code: 1,
          msg: '获取频道name成功',
          data,
        };
      } else {
        this.response = {
          code: 0,
          msg: '获取频道name失败',
          data,
        };
      }
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取频道name失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // -----------------------------根据频道name查找数据接口------------------------------------------------------
  public async findChannelByName(name: string, page: number) {
    try {
      const data: any = await this.ChannelModel.find({
        name,
      })
        .sort({ _id: -1 })
        .skip(page > 1 ? (page - 1) * this.pageSize : 0)
        .limit(this.pageSize);
      if (data) {
        this.response = {
          code: 1,
          msg: '获取频道数据成功',
          data,
        };
      } else {
        this.response = {
          code: 0,
          msg: '频道不存在',
          data,
        };
      }
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取频道数据失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }

  // -----------------------返回搜索联想建议--------------------------------------------------------------------
  public async searchSuggest(content: string) {
    try {
      const data: any = await this.ChannelModel.find({
        content: { $regex: `^${content}`, $options: 'i' },
      }).limit(6);
      if (data) {
        this.response = {
          code: 1,
          msg: '获取搜索建议成功',
          data,
        };
      } else {
        this.response = {
          code: 0,
          msg: '获取搜索建议失败',
          data,
        };
      }
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取搜索建议失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }

  // -----------------------------根据搜索内容返回数据结果------------------------------------------------------
  public async findChannelByContent(content: string) {
    try {
      const data: any = await this.ChannelModel.findOne({
        content,
      });

      if (data) {
        this.response = {
          code: 1,
          msg: '获取频道内容成功',
          data,
        };
      } else {
        this.response = {
          code: 0,
          msg: '频道内容不存在',
          data,
        };
      }
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取频道内容失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
}
