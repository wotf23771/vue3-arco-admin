import type { Router } from "vue-router";
import NProgress from "nprogress"; // progress bar
import { useUserStore } from "@/store";
import { isLogin } from "@/utils/auth";
import { getOAuth2AuthorizeUrl } from "@/api/user";

const allowList = ["login", "500", "403", "loginDeny", "logout"]; // no redirect allowList
const loginRoutePath = "/oauth2-login";
const defaultRoutePath = "/";
export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    if (allowList.includes(to.name as string)) {
      // 在免登录名单，直接进入
      next();
    } else {
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath });
      } else {
        const userStore = useUserStore();
        if (isLogin()) {
          if (userStore.id) {
            next();
          } else {
            await userStore.initInfo();
            next();
          }
        } else {
          // 未登录
          getOAuth2AuthorizeUrl(import.meta.env.VITE_APP_OAUTH2_REDIRECT_URI).then(res => {
            location.replace(res.data);
          });
        }
      }
    }
  });
}
