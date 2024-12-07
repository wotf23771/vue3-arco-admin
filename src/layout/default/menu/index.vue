<script lang="jsx">
import { useAppStore } from "@/store";
import { openWindow, regexUrl } from "@/utils";
import { listenerRouteChange } from "@/utils/route-listener";
import { compile, computed, defineComponent, h, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useMenuTree from "./use-menu-tree";

export default defineComponent({
  emit: ["collapse"],
  setup() {
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const { menuTree } = useMenuTree();
    const collapsed = computed({
      get() {
        if (appStore.device === "desktop") return appStore.menuCollapse;
        return false;
      },
      set(value) {
        appStore.updateSettings({ menuCollapse: value });
      },
    });

    const topMenu = computed(() => appStore.topMenu);
    const openKeys = ref([]);
    const selectedKey = ref([]);

    const goto = (item) => {
      // Open external link
      if (regexUrl.test(item.path)) {
        openWindow(item.path);
        selectedKey.value = [item.name];
        return;
      }
      // Eliminate external link side effects
      if (route.name === item.name) {
        selectedKey.value = [item.name];
        return;
      }
      // Trigger router change
      router.push({
        path: item.path,
      });
    };
    const findMenuOpenKeys = (target) => {
      const result = [];
      let isFind = false;
      const backtrack = (item, keys) => {
        if (item.path === target) {
          isFind = true;
          result.push(...keys);
          return;
        }
        if (item.children?.length) {
          item.children.forEach((el) => {
            backtrack(el, [...keys, el.path]);
          });
        }
      };
      menuTree.value.forEach((el) => {
        if (isFind) return; // Performance optimization
        backtrack(el, [el.path]);
      });
      return result;
    };
    listenerRouteChange((newRoute) => {
      const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
      // if (requiresAuth && (!hideInMenu || activeMenu)) {
      const menuOpenKeys = findMenuOpenKeys(activeMenu || newRoute.path);
      const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
      openKeys.value = [...keySet];

      selectedKey.value = [activeMenu || menuOpenKeys[menuOpenKeys.length - 1]];
      // }
    }, true);
    const setCollapse = (val) => {
      if (appStore.device === "desktop")
        appStore.updateSettings({ menuCollapse: val });
    };

    const renderSubMenu = () => {
      function travel(_route, nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            // This is demo, modify nodes as needed
            const icon = element?.icon
                ? () => h(compile(`<${element?.icon}/>`))
                : null;
            const node =
                element?.children && element?.children.length !== 0 ? (
                    <a-sub-menu
                        key={element?.path}
                        v-slots={{
                          icon,
                          title: () => h(compile(element?.name || "")),
                        }}
                    >
                      {travel(element?.children)}
                    </a-sub-menu>
                ) : (
                    <a-menu-item
                        key={element?.path}
                        v-slots={{ icon }}
                        onClick={() => goto(element)}
                    >
                      {element?.name || ""}
                    </a-menu-item>
                );
            nodes.push(node);
          });
        }
        return nodes;
      }

      return travel(menuTree.value);
    };

    return () => (
        <a-menu
            mode={topMenu.value ? "horizontal" : "vertical"}
            v-model:collapsed={collapsed.value}
            v-model:open-keys={openKeys.value}
            show-collapse-button={appStore.device !== "mobile"}
            auto-open={false}
            selected-keys={selectedKey.value}
            auto-open-selected={true}
            level-indent={34}
            style="height: 100%;width:100%;"
            onCollapse={setCollapse}
        >
          {renderSubMenu()}
        </a-menu>
    );
  },
});
</script>

<style lang="less" scoped>
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }

  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>
