import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  Req,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserAdminService } from './userAdmin.service';

@Controller('userAdmin')
@ApiTags('用户管理API')
@ApiBearerAuth('jwt') // 这个是用来在swagger中测试token的，本身不能触发token守卫
export class UserAdminController {
  constructor(private userAdminService: UserAdminService) {}
  @Get('all/:page')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '查找指定页码，并返回指定条数用户信息' })
  public findAllUser(@Param('page') page: number) {
    return this.userAdminService.findUserByPage(page);
  }
  @Get('findUser')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据用户名返回指定用户数据' })
  public findUser(@Query('userName') userName: string) {
    return this.userAdminService.findUserByUserName(userName);
  }
  @Get('findUserById')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据id返回指定用户数据' })
  public findUserByIdFun(@Req() req) {
    return this.userAdminService.findUserById(req.user._id);
  }
  @Get('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '删除用户' })
  public removeUser(@Param('id') UserId: string) {
    return this.userAdminService.delUser(UserId);
  }
}
