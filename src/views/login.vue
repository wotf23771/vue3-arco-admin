<template>
  <div id="loader-wrapper">
    <div class="first-loading-wrp">
      <div class="loading-wrp">
        <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
      </div>
      <div style="display: flex; justify-content: center; align-items: center;">登录中</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  const { code, state } = router.currentRoute.value.query;
  await userStore.login(code, state);
  router.push({ path: "/" });
});
</script>

<style scoped>

</style>
