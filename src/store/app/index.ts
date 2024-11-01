import { getUserMenu } from "@/api/login";
import defaultSettings from "@/config/settings.json";
import { Notification } from "@arco-design/web-vue";
import { defineStore } from "pinia";

const useAppStore = defineStore("app", {
  state: () => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state) {
      return { ...state };
    },
    appDevice(state) {
      return state.device;
    },
    appMenus(state) {
      return state.menus;
    },
    appTitle() {
      return import.meta.env.VITE_APP_TITLE;
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark) {
      if (dark) {
        this.theme = "dark";
        document.body.setAttribute("arco-theme", "dark");
      } else {
        this.theme = "light";
        document.body.removeAttribute("arco-theme");
      }
    },
    toggleDevice(device) {
      this.device = device;
    },
    toggleMenu(value) {
      this.hideMenu = value;
    },
    async initMenu() {
      try {
        const { data } = await getUserMenu();
        this.menus = data ? data : [];
      } catch (error) {
        Notification.error({
          id: "menuNotice",
          content: "error",
          closable: true,
        });
      }
    },
    clearMenu() {
      this.menus = [];
    },
  },
});

export default useAppStore;
