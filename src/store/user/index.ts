import { getUserInfo, login, logout as userLogout, oauth2Login } from "@/api/login";
import { clearToken, setToken, setUserKey } from "@/utils/auth";
import { removeRouteListener } from "@/utils/route-listener";
import { defineStore } from "pinia";
import useAppStore from "../app";
import { UserState } from "./types";

const useUserStore = defineStore("user", {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    account: undefined,
    orgId: undefined,
    orgName: undefined,
    orgPathName: undefined,
    avatar: undefined,
    loginError: "",
    admin: false,
    allowLogin: true,
  }),

  getters: {
    userInfo(state) {
      return { ...state };
    },
  },

  actions: {
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
    async login(code: string, state: string) {
      try {
        const { data } = await oauth2Login(code, state);
        const { access_token, private_key, secret_key } = data;
        setToken(access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    // webLogin
    async webLogin(username: string, password: string) {
      try {
        const { data, success, message } = await login(username, password);
        if (!success) {
          throw new Error(message ? message : "登录失败");
        }
        const { access_token, private_key, secret_key } = data;
        setToken(access_token);
        setUserKey(private_key, secret_key);
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
