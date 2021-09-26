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
  // -----------------------------------------------------------------------------------
  public async channelName() {
    return (this.response = {
      code: 1,
      msg: '获取频道name成功',
      data: [
        { id: 1, name: '频道1' },
        { id: 2, name: '频道2' },
        { id: 3, name: '频道3' },
        { id: 4, name: '频道4' },
      ],
    });
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
}
