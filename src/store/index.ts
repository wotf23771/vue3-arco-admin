import { createPinia } from "pinia";
import useAppStore from "./modules/app";
import useUserStore from "./modules/user";
import useTabBarStore from "./modules/tab-bar";
import useOrganStore from "./modules/organ";
import useFlowStore from "./modules/flow";

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useOrganStore, useFlowStore };
export default pinia;
