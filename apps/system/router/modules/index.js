const appRoutes = [
  {
    path: "/",
    component: () => import("@/layout/default/default-layout.vue"),
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("../../views/index/index.vue"),
        meta: {
          title: "首页",
        },
      },
    ],
  },
  {
    path: "/sys",
    component: () => import("@/layout/default/default-layout.vue"),
    children: [
      {
        path: "menu",
        name: "Menu",
        component: () => import("../../views/menu/index.vue"),
        meta: {
          title: "菜单管理",
          ignoreCache: false,
        },
      },
      {
        path: "dict",
        name: "Dict",
        component: () => import("../../views/dict/index.vue"),
        meta: {
          title: "数据字典",
          ignoreCache: false,
        },
      },
      {
        path: "config",
        name: "Config",
        component: () => import("../../views/config/index.vue"),
        meta: {
          title: "系统参数",
          ignoreCache: false,
        },
      },
      {
        path: "org",
        name: "Org",
        component: () => import("../../views/org/index.vue"),
        meta: {
          title: "组织管理",
          ignoreCache: false,
        },
      },
      {
        path: "user",
        name: "User",
        component: () => import("../../views/user/index.vue"),
        meta: {
          title: "用户管理",
          ignoreCache: false,
        },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("../../views/role/index.vue"),
        meta: {
          title: "角色管理",
          ignoreCache: false,
        },
      },
    ],
  },
];

export default appRoutes;
