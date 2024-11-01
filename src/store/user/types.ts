export interface UserState {
  // 用户ID
  id: string;
  // 用户姓名
  name: string;
  // 用户账号
  account: string;
  // 用户所在组织ID
  orgId: string;
  // 用户所在组织名称
  orgName: string;
  // 用户所在组织路径名称
  orgPathName: string;
  // 用户头像
  avatar: string;
  // 登录错误信息
  loginError: string;
  // 是否允许登录
  allowLogin: boolean;
  // 是否是业务管理员
  admin: boolean;
}