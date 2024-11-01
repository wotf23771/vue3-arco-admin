import { setRouteEmitter } from "@/utils/route-listener";
import setupPermissionGuard from "./permission";
import setupUserLoginInfoGuard from "./userLoginInfo.js";

function setupPageGuard(router) {
  router.beforeEach(async (to) => {
    // emit route change
    setRouteEmitter(to);
  });
}

export default function createRouteGuard(router) {
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}
