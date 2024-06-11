<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">登录</div>
    <!--    <div class="login-form-sub-title">登录</div>-->
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
        ref="loginForm"
        :model="userInfo"
        class="login-form"
        layout="vertical"
        @submit="handleSubmit"
    >
      <a-form-item
          field="username"
          :rules="[{ required: true, message: '用户名不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
      >
        <a-input
            v-model="userInfo.username"
            placeholder="用户名：admin"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
          field="password"
          :rules="[{ required: true, message: '密码不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
      >
        <a-input-password
            v-model="userInfo.password"
            placeholder="密码：admin"
            allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-link>忘记密码</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          登录
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { useUserStore } from "@/store";
import useLoading from "@/hooks/loading";

const router = useRouter();
const errorMessage = ref("");
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

const loginConfig = ref({
  rememberPassword: true,
  username: "admin",
  password: "1",
});
const userInfo = reactive({
  username: loginConfig.value.username,
  password: loginConfig.value.password,
});

const handleSubmit = async ({ errors, values }) => {
  if (loading.value) {
    return;
  }
  if (errors) {
    return;
  }
  setLoading(true);
  try {
    const { username, password } = values;
    await userStore.webLogin(username, password);
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    await router.push({ path: "/" });
    Message.success("欢迎使用");
    // const { rememberPassword } = loginConfig.value;
    // 实际生产环境需要进行加密存储。
    // The actual production environment requires encrypted storage.
    // loginConfig.value.username = rememberPassword ? username : "";
    // loginConfig.value.password = rememberPassword ? password : "";
  } catch (err) {
    errorMessage.value = err.message ? err.message : "登录失败";
  } finally {
    setLoading(false);
  }
};
const setRememberPassword = (value) => {
  // loginConfig.value.rememberPassword = value;
};
</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
