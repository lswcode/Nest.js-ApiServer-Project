import { Injectable, Logger } from '@nestjs/common';
import { Article } from 'src/interface/article.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { responseInterface } from 'src/interface/response.interface';

@Injectable()
export class ArticleService {
  private response: responseInterface;
  private pageSize = 6; //设置每页条数
  private pageCount: number; //总页数，返回给前端，让前端设置分页条数
  constructor(
    @InjectModel('ARTICLE_MODEL') private readonly ArticleModel: Model<Article>,
  ) {}

  // -----------------------------创建文章接口------------------------------------------------------
  public async createArticle(article: Article) {
    const createArticle = new this.ArticleModel(article);
    createArticle.date = createArticle._id.getTimestamp().toLocaleString(); // 格式化创建文件的时间
    try {
      const data = await createArticle.save();
      this.response = {
        code: 1,
        msg: '文章创建成功',
        id: data._id,
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '文章创建失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // -------------------------------删除文章接口-------------------------------------------------------------------------
  public async delArticle(articleId: string) {
    try {
      const data = await this.ArticleModel.findByIdAndDelete(articleId);
      // 如果ID正确，data存在则执行下面代码，ID不存在则会报错，去执行catch中的代码
      this.response = {
        code: 1,
        msg: '文章删除成功',
        data: data._id,
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '文章删除失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // --------------------------------修改文章接口------------------------------------------------------
  public async changeArticle(articleId: string, articleContent: Article) {
    try {
      console.log(articleContent);

      await this.ArticleModel.findByIdAndUpdate(articleId, articleContent);
      // mongoose只会把articleContent中存在的内容更新，如果没写对应的键值对，则不会更新，例如传过来的数据中没有title只有content，则只会更新content
      this.response = {
        code: 1,
        msg: '文章修改成功',
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '文章修改失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // ----------------------------------查找单篇文章接口-----------------------------------------------------------
  public async findArticle(articleId: string) {
    try {
      console.log(articleId);
      const data = await this.ArticleModel.findById(articleId);
      this.response = {
        code: 1,
        msg: '文章查询成功',
        data,
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '文章查询失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
  // -------------------------------查找指定页码，并返回指定条数文章的接口---------------------------------------------------------------------------
  public async findArticleByPage(page) {
    try {
      const dataNum = (await this.ArticleModel.find()).length;
      // 和前端约定好一页的数量，就可以根据前端请求的页码请求指定位置的数据
      const data = await this.ArticleModel.find()
        .sort({ _id: -1 })
        .skip(page > 1 ? (page - 1) * this.pageSize : 0)
        .limit(this.pageSize);
      this.pageCount = Math.ceil(dataNum / this.pageSize);
      // Math.ceil取整函数，对数字向上取整
      this.response = {
        code: 1,
        msg: '获取文章数据成功',
        data,
        pageSize: this.pageSize, // 每页条数
        pageCount: this.pageCount, // 总页数
        dataNum, // 总数据条数
      };
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: '获取文章数据失败',
        data: error,
      };
    } finally {
      return this.response;
    }
  }
}
