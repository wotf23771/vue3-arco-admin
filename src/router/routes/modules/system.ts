import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const FORM: AppRouteRecordRaw = {
  path: "/system",
  name: "system",
  component: DEFAULT_LAYOUT,
  meta: {
    locale: "系统管理",
    icon: "icon-settings",
    requiresAuth: true,
    order: 3
  },
  children: [
    {
      path: "dict",
      name: "dict",
      component: () => import("@/views/system/dict/index.vue"),
      meta: {
        locale: "数据字典",
        icon: "icon-list",
        requiresAuth: true
      }
    },
    {
      path: "config",
      name: "config",
      component: () => import("@/views/system/config/index.vue"),
      meta: {
        locale: "参数配置",
        icon: "icon-list",
        requiresAuth: true
      }
    }
  ]
};

export default FORM;
