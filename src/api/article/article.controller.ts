/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/guards/role.decorator';
import { Article } from 'src/interface/article.interface';
import { ArticleService } from './article.service';
// import { UserGuard } from 'src/guards/user.guard';
@Controller('article')
@ApiTags('文章接口')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Post('create')
  @ApiOperation({ summary: '创建文章' })
  public addArticle(@Body() article: Article) {
    return this.articleService.createArticle(article);
  }

  @Post('delete/:id')
  @ApiOperation({ summary: '删除文章' })
  public removeArticle(@Param('id') articleId: string) {
    return this.articleService.delArticle(articleId);
  }

  @Post('change/:id')
  @ApiOperation({ summary: '修改文章' })
  public changeArticle(
    @Param('id') articleId: string,
    @Body() article: Article,
  ) {
    return this.articleService.changeArticle(articleId, article);
  }

  @Post('find/:id')
  @ApiOperation({ summary: '查询单篇文章接口' })
  public findArticle(@Param('id') articleId: string) {
    return this.articleService.findArticle(articleId);
  }

  @Get('all/:page')
  @ApiOperation({ summary: '查找指定页码，并返回指定条数文章的接口' })
  public findAllArticle(@Param('page') page: number) {
    return this.articleService.findArticleByPage(page);
  }
}
