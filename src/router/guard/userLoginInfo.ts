import { WHITE_PATH } from "@/router/constants";
import { useUserStore } from "@/store";
import { isLogin } from "@/utils/auth";
import NProgress from "nprogress"; // progress bar
import type { Router } from "vue-router";

const loginPath = "/login"; // 登录地址
export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    if (WHITE_PATH.includes(to.path)) {
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
        if (to.path === loginPath) {
          next();
        } else {
          next({ path: loginPath });
        }
      }
    }
  });
}
