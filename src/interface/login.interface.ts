/* eslint-disable prettier/prettier */
export interface loginInterface {
  code: number; // 1:登录成功 0:登录失败，用户不存在  2:账号或密码错误
  msg: unknown;
  userId?: string;
  token?: string;
}
