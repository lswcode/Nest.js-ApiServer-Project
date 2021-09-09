import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/guards/role.decorator';
import { User, UserAuth } from 'src/interface/user.interface';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('用户API')
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录接口' })
  public async UserAuth(@Body() userDto: UserAuth) {
    return await this.userService.login(userDto);
  }

  @Post('regist')
  @ApiOperation({ summary: '用户注册接口' })
  async registFun(@Body() userDto: User) {
    return await this.userService.regist(userDto);
  }

  @Post('change')
  @ApiOperation({ summary: '用户修改密码接口' })
  public async userChange(@Body() userDto: UserAuth) {
    return await this.userService.changePsaaword(userDto);
  }

  // -------------------------------------------------------------
  @Get('test-Guards')
  @UseGuards(AuthGuard('jwt'))
  @Role('admin')
  hello() {
    return 'hello';
  }
}
