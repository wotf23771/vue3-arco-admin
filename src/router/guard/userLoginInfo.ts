import type { Router } from "vue-router";
import NProgress from "nprogress"; // progress bar
import { useUserStore } from "@/store";
import { isLogin } from "@/utils/auth";

const allowList = ["login", "500", "403", "401", "loginDeny", "logout"]; // 白名单路由
const loginRoutePath = "/login"; // 登录地址
const defaultRoutePath = "/"; // 默认首页
export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    console.log("router name", to.name);
    if (allowList.includes(to.name as string)) {
      // 在免登录名单，直接进入
      next();
    } else {
      const userStore = useUserStore();
      if (isLogin()) {
        // 已登录
        if (userStore.id) {
          next();
        } else {
          await userStore.initInfo();
          next();
        }
      } else {
        // 未登录
        if (to.path === loginRoutePath) {
          next();
        } else {
          next({ path: "/login" });
        }
      }
    }
  });
}
