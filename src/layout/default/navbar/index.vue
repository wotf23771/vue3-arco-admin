<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img style="height:50px" alt="logo" src="../../../assets/logo.svg" />
        <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
          {{ appTitle }}
        </a-typography-title>
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="isFullscreen ? '退出全屏' : '全屏'">
          <a-button
              class="nav-btn"
              type="outline"
              :shape="'circle'"
              @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="hover">
          <div style="cursor: pointer;">
            <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
              <img alt="avatar" :src="avatar" />
            </a-avatar>
            <span style="user-select: none;">{{ userName }}</span>
          </div>
          <template #content>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  退出系统
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useFullscreen } from "@vueuse/core";
import { useAppStore, useUserStore } from "@/store";
import useUser from "@/hooks/user";
import Menu from "@/layout/default/menu/index.vue";
import defaultAvatar from "@/assets/default-avatar.png";

const appStore = useAppStore();
const userStore = useUserStore();
const { logout } = useUser();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
const avatar = computed(() => {
  return userStore.avatar ? userStore.avatar : defaultAvatar;
});
const appTitle = appStore.appTitle;
const userName = computed(() => {
  return userStore.name;
});
const topMenu = computed(() => appStore.topMenu && appStore.menu);

const handleLogout = () => {
  logout();
};
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 5px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
