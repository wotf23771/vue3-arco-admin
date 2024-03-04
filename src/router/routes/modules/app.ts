import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const FORM: AppRouteRecordRaw = {
  path: "/app",
  name: "app",
  component: DEFAULT_LAYOUT,
  meta: {
    locale: "应用",
    icon: "icon-home",
    requiresAuth: true,
    order: 3
  },
  children: [
    {
      path: "info",
      name: "info1",
      component: () => import("@/views/app/info/index.vue"),
      meta: {
        locale: "应用注册",
        icon: "icon-launch",
        requiresAuth: true,
        roles: ["*"]
      }
    },
    {
      path: "form",
      name: "form1",
      component: () => import("@/views/app/form/index.vue"),
      meta: {
        locale: "应用表单",
        icon: "icon-select-all",
        requiresAuth: true,
        roles: ["*"]
      }
    },
    {
      path: "hookLog",
      name: "hookLog",
      component: () => import("@/views/app/hooklog/index.vue"),
      meta: {
        locale: "回调日志",
        icon: "icon-history",
        requiresAuth: true,
        roles: ["*"]
      }
    }
  ]
};

export default FORM;
