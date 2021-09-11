import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Role } from 'src/guards/role.decorator';
import { User, UserAuth, UserInfo } from 'src/interface/user.interface';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('用户API')
@ApiBearerAuth('jwt') // 这个是用来在swagger中测试token的，本身不能触发token守卫
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录接口' })
  public async userAuth(@Body() userDto: UserAuth) {
    return await this.userService.login(userDto, false);
  }
  @Post('backstageLogin')
  @ApiOperation({ summary: '后台登录接口' })
  public async backstageAuth(@Body() userDto: UserAuth) {
    return await this.userService.login(userDto, true);
  }

  @Post('regist')
  @ApiOperation({ summary: '用户注册接口' })
  async registFun(@Body() userDto: User) {
    return await this.userService.regist(userDto);
  }

  @Post('change')
  @UseGuards(AuthGuard('jwt')) // 这个才是用来触发token守卫的
  @ApiOperation({ summary: '用户修改密码接口' })
  public async userChange(@Body() userDto: UserAuth) {
    return await this.userService.changePsaaword(userDto);
  }

  // -------------------------------------------------------------
  @Post('information')
  @UseGuards(AuthGuard('jwt')) // 这个才是用来触发token守卫的
  @ApiOperation({ summary: '用户个人信息添加和修改' })
  public async userInforFun(@Req() req, @Body() information: UserInfo) {
    console.log(req.user._id);

    return await this.userService.userInfor(req.user._id, information);
  }

  // @Get('test-Guards')
  // @UseGuards(AuthGuard('jwt'))
  // @Role('admin')
  // hello() {
  //   return 'hello';
  // }
}
