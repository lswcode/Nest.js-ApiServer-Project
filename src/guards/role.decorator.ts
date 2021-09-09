import { SetMetadata } from '@nestjs/common';

export const Role = (...args: string[]) => SetMetadata('role', args);
// 设置权限，即Role()括号内传入的就是权限名
