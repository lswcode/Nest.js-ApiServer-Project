import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { TaskInter } from 'src/interface/task.interface';
@Controller('task')
@ApiTags('任务系统API')
@ApiBearerAuth('jwt')
export class TaskController {
  constructor(private TaskService: TaskService) {}
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '创建任务列表' })
  public addTask(@Body() task: TaskInter) {
    return this.TaskService.createTask(task);
  }

  @Get('taskList')
  @ApiOperation({ summary: '返回任务列表' })
  public taskNameFun() {
    return this.TaskService.getTaskList();
  }
}
