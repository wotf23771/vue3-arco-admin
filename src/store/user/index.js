import { defineStore } from "pinia";
import { getUserInfo, login, logout as userLogout, oauth2Login } from "@/api/login";
import { clearToken, setToken } from "@/utils/auth";
import { removeRouteListener } from "@/utils/route-listener";
import useAppStore from "../app";

const useUserStore = defineStore("user", {
  state: () => ({
    id: undefined,
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: "",
  }),

  getters: {
    userInfo(state) {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === "user" ? "admin" : "user";
        resolve(this.role);
      });
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async initInfo() {
      const { data } = await getUserInfo();
      this.$patch(data);
    },

    // Login
    async login(code, state) {
      try {
        const { access_token } = await oauth2Login(code, state);
        setToken(access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    // webLogin
    async webLogin(username, password) {
      try {
        const { data, success, message } = await login(username, password);
        if (!success) {
          throw new Error(message ? message : "登录失败");
        }
        const { access_token } = data;
        setToken(access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
