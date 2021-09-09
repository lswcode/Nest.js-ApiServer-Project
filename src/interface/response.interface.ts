/* eslint-disable prettier/prettier */
export interface responseInterface {
  code: number; // 1:注册成功 0:注册失败，账号已被注册  2:出现未知错误
  msg: unknown;
  [propname: string]: any; // 其它任意值
}
