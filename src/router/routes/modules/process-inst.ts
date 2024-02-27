import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const FORM: AppRouteRecordRaw = {
  path: "/inst",
  name: "inst",
  component: DEFAULT_LAYOUT,
  meta: {
    locale: "流程实例",
    icon: "icon-list",
    requiresAuth: true,
    order: 3
  },
  children: [
    {
      path: "all",
      name: "all",
      component: () => import("@/views/inst/all/index.vue"),
      meta: {
        locale: "全部实例",
        icon: "icon-list",
        requiresAuth: true
      }
    }
  ]
};

export default FORM;
