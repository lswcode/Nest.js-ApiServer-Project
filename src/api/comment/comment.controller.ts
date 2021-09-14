import {
  Controller,
  UseGuards,
  Get,
  Body,
  Post,
  Req,
  Param,
  Query,
  Put,
} from '@nestjs/common';
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
  public addComment(@Req() req, @Body() comment: Comment) {
    return this.commentService.createComment(comment, req.user.userName);
  }

  @Get('all/:page')
  @ApiOperation({ summary: '查询指定页码的用户评论' })
  public findAllComment(@Param('page') page: number) {
    return this.commentService.findComment(page);
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '更新评论显示状态' })
  public findUser(@Query('_id') _id: string, @Body('show') show: boolean) {
    return this.commentService.updateComment(_id, show);
  }
}
