import { createPinia } from "pinia";
import useAppStore from "./app";
import useTabBarStore from "./tab-bar";
import useUserStore from "./user";

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore };
export default pinia;
