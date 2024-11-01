import usePermission from "@/hooks/permission";
import { useAppStore } from "@/store";
import cloneDeep from "lodash-es/cloneDeep";
import { computed } from "vue";

export default function useMenuTree() {
  const permission = usePermission();
  const appStore = useAppStore();
  const appRoute = computed(() => {
    return appStore.appMenus;
  });
  const menuTree = computed(() => {
    return cloneDeep(appRoute.value);
  });

  return {
    menuTree,
  };
}
