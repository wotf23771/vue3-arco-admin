const appRoutes = [
  {
    path: "/",
    component: () => import("@/layout/default/default-layout.vue"),
    children: [
      {
        path: "index",
        name: "首页",
        component: () => import("../views/index/index.vue"),
      },
    ],
  },
  {
    path: "/sys",
    component: () => import("@/layout/default/default-layout.vue"),
    children: [
      {
        path: "menu",
        name: "菜单管理",
        component: () => import("../views/menu/index.vue"),
      },
      {
        path: "dict",
        name: "数据字典",
        component: () => import("../views/dict/index.vue"),
      },
      {
        path: "config",
        name: "系统参数",
        component: () => import("../views/config/index.vue"),
      },
      {
        path: "org",
        name: "组织管理",
        component: () => import("../views/org/index.vue"),
      },
      {
        path: "user",
        name: "用户管理",
        component: () => import("../views/user/index.vue"),
      },
      {
        path: "role",
        name: "角色管理",
        component: () => import("../views/role/index.vue"),
      },
    ],
  },
];

export default appRoutes;
