import { Controller, UseGuards, Get, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from 'src/interface/comment.interface';
import { CommentService } from './comment.service';

@Controller('comment')
@ApiTags('用户评论接口')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post('create')
  @ApiOperation({ summary: '创建评论' })
  public addComment(@Body() comment: Comment) {
    return this.commentService.createComment(comment);
  }

  @Get('all')
  @ApiOperation({ summary: '查询所有用户评论' })
  public findAllComment() {
    return this.commentService.findComment();
  }
}
