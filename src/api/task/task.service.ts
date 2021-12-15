import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskInter } from 'src/interface/task.interface';
import { InjectModel } from '@nestjs/mongoose';
import { responseInterface } from 'src/interface/response.interface';

@Injectable()
export class TaskService {
  private response: responseInterface;
  constructor(
    @InjectModel('TASK_MODEL') private readonly TaskModel: Model<TaskInter>,
  ) {}

  async handleFun(fun, message: string) {
    try {
      const data: any = await fun;
      if (data) {
        this.response = {
          code: 1,
          msg: `${message}成功`,
          data,
        };
      } else {
        this.response = {
          code: 0,
          msg: `${message}失败`,
          data,
        };
      }
    } catch (error) {
      Logger.warn(error);
      this.response = {
        code: 0,
        msg: `${message}失败`,
        data: error,
      };
    } finally {
      return this.response;
    }
  }

  // -----------------------------创建任务接口------------------------------------------------------
  public createTask(task: any) {
    const createTask = new this.TaskModel(task);
    createTask.date = createTask._id.getTimestamp().toLocaleDateString(); // 格式化创建文件的时间
    return this.handleFun(createTask.save(), '任务数据创建');
  }
  // ---------获取任务列表接口--------------------------------------------------------------------
  public getTaskList() {
    return this.handleFun(this.TaskModel.find(), '任务数据创建');
  }
}
