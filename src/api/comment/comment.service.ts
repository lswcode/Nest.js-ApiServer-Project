import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { responseInterface } from 'src/interface/response.interface';
import { Comment } from 'src/interface/comment.interface';

@Injectable()
export class CommentService {
  private response: responseInterface;
  private pageSize = 6; //设置每页条数
  private pageCount: number; //总页数，返回给前端，让前端设置分页条数
  constructor(
    @InjectModel('COMMENT_MODEL') private readonly CommentModel: Model<Comment>,
  ) {}

  // -----------------------------创建评论接口------------------------------------------------------
  public async createComment(comment: Comment, userName: string) {
    comment.show = true;
    comment.userName = userName;
    const createComment = new this.CommentModel(comment);
    createComment.date = createComment._id.getTimestamp().toLocaleDateString(); // 格式化创建文件的时间
    try {
      const data = await createComment.save();
      this.response = {
        code: 1,
        msg: '评论创建成功',
        id: data._id,
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '评论创建失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }

  // ----------------------------------查找指定页码评论的接口-----------------------------------------------------------
  public async findComment(page) {
    try {
      const dataNum = (await this.CommentModel.find()).length;
      // 和前端约定好一页的数量，就可以根据前端请求的页码请求指定位置的数据
      // 当根据文章返回指定评论时需要加上find({show:true})
      const res = await this.CommentModel.find()
        .sort({ _id: -1 })
        .skip(page > 1 ? (page - 1) * this.pageSize : 0)
        .limit(this.pageSize);
      this.pageCount = Math.ceil(dataNum / this.pageSize);
      // Math.ceil取整函数，对数字向上取整
      this.response = {
        code: 1,
        msg: '评论查询成功',
        data: res,
        pageSize: this.pageSize, // 每页条数
        pageCount: this.pageCount, // 总页数
        dataNum, // 总数据条数
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '评论查询失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // --------------修改评论显示状态-------------------------------------------------------------------
  public async updateComment(_id: string, show: boolean) {
    try {
      console.log(show);
      const data = await this.CommentModel.findByIdAndUpdate(_id, {
        show,
      });
      // console.log(data); // 更新数据时，返回的值是原数据，而不是更新后的数据
      // const res = await this.CommentModel.findById(_id);
      // console.log(res); // 重新查询才能看到更新后的数据
      this.response = {
        code: 1,
        msg: '评论显示状态修改成功',
        data,
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '评论显示状态修改失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
}
