import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { responseInterface } from 'src/interface/response.interface';
import { Comment } from 'src/interface/comment.interface';

@Injectable()
export class CommentService {
  private response: responseInterface;
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

  // ----------------------------------查找所有评论接口-----------------------------------------------------------
  public async findComment() {
    try {
      const data = await this.CommentModel.find({ show: true });
      this.response = {
        code: 1,
        msg: '评论查询成功',
        data,
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
