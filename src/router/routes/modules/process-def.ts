import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const FORM: AppRouteRecordRaw = {
  path: "/def",
  name: "def",
  component: DEFAULT_LAYOUT,
  meta: {
    locale: "流程定义",
    icon: "icon-code",
    requiresAuth: true,
    order: 3,
  },
  children: [
    {
      path: "config",
      name: "def_config",
      component: () => import("@/views/def/config/index.vue"),
      meta: {
        locale: "流程配置",
        icon: "icon-share-alt",
        requiresAuth: true,
      },
    },
    {
      path: "flowmanedit",
      name: "flowmanedit",
      component: () => import("@/views/def/config/FlowDesign.vue"),
      meta: {
        locale: "流程配置",
        icon: "icon-share-alt",
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export default FORM;
