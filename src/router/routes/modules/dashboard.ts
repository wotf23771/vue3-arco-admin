import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const DASHBOARD: AppRouteRecordRaw = {
  path: "/dashboard",
  name: "dashboard",
  component: DEFAULT_LAYOUT,
  meta: {
    locale: "首页",
    requiresAuth: true,
    icon: "icon-dashboard",
    order: 0
  },
  children: [
    {
      path: "workplace",
      name: "Workplace",
      component: () => import("@/views/index.vue"),
      meta: {
        locale: "首页",
        requiresAuth: true,
        hideInMenu: true
      }
    }
  ]
};

export default DASHBOARD;
