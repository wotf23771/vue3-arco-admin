import usePermission from "@/hooks/permission";
import { NOT_FOUND, WHITE_NAME } from "@/router/constants";
import { useAppStore, useUserStore } from "@/store";
import NProgress from "nprogress"; // progress bar
import type { Router } from "vue-router";

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (!appStore.appMenus.length && !WHITE_NAME.includes(to.name as string)) {
      await appStore.initMenu();
    }
    const serverMenuConfig = [...appStore.appMenus];
    // if (to.path === "/index") {
    //   next({ path: "/sys/menu", replace: true });
    //   return;
    // }
    let exist = false;
    while (serverMenuConfig.length && !exist) {
      const element = serverMenuConfig.shift();
      if (element?.name === to.name || element?.path === to.path) {
        exist = true;
      }

      if (element?.children) {
        serverMenuConfig.push(...(element.children));
      }
    }
    if (permissionsAllow) {
      next();
    } else {
      next(NOT_FOUND);
    }
    NProgress.done();
  });
}
