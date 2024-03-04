import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";

import { appRoutes } from "./routes";
import { NOT_FOUND_ROUTE, REDIRECT_MAIN } from "./routes/base";
import createRouteGuard from "./guard";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes: [
    {
      path: "/",
      redirect: "/dashboard/workplace",
    },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: () => import("@/views/login/index.vue"),
    //   meta: {
    //     requiresAuth: false,
    //   },
    // },
    {
      path: "/oauth2-login",
      name: "login",
      component: () => import("@/views/login.vue"),
    },
    {
      path: "/401",
      name: "401",
      component: () => import("@/views/exception/401/index.vue"),
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
