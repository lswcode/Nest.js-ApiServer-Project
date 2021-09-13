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
  public async createComment(comment: Comment, userName) {
    comment.show = true;
    comment.userName = userName;
    console.log(userName);
    const createComment = new this.CommentModel(comment);
    createComment.date = createComment._id.getTimestamp().toLocaleString(); // 格式化创建文件的时间
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
      const dataNum = (await this.CommentModel.find({ show: true })).length;
      // 和前端约定好一页的数量，就可以根据前端请求的页码请求指定位置的数据
      const res = await this.CommentModel.find({ show: true })
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
}
