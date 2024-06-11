import NProgress from "nprogress"; // progress bar
import usePermission from "@/hooks/permission";
import { useAppStore, useUserStore } from "@/store";
import { NOT_FOUND, WHITE_LIST } from "@/router/constants";

export default function setupPermissionGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (
      !appStore.appMenus.length &&
      !WHITE_LIST.find((el) => el.name === to.name || el.path === to.path)
    ) {
      await appStore.initMenu();
    }
    const serverMenuConfig = [...appStore.appMenus, ...WHITE_LIST];
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
