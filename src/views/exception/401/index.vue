<template>
  <div class="container">
    <div class="content">
      <a-result class="result" status="error" :subtitle="message" />
      <a-button key="back" type="primary" @click="handleBack">
        返回
      </a-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "401",
};
</script>
<script setup>
import { useUserStore } from "@/store/index.js";
import { computed } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();

const message = computed(() => {
  return userStore.loginError || "登录失败";
});

console.log(userStore.loginError);
const router = useRouter();
const handleBack = () => {
  router.replace({ path: "/" });
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: calc(100% - 40px);

  :deep(.content) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    background-color: var(--color-bg-1);
    border-radius: 4px;
  }
}
</style>
