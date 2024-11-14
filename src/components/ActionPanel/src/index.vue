<template>
  <div class="page-wrapper" v-if="visible">
    <a-page-header @back="handleBack" title="返回"/>
    <div class="main">
      <slot name="default"></slot>
    </div>
    <a-divider v-if="!hideFooter" style="margin: 10px 0"/>
    <div class="footer" v-if="!hideFooter">
      <a-spin :loading="loading">
        <slot name="footer">
          <a-space>
            <a-button @click="handleBack" v-if="!hideCancel">{{ cancelText }}</a-button>
            <a-button type="primary" @click="handleOk" v-if="!hideOk">{{ okText }}</a-button>
          </a-space>
        </slot>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
  hideOk: {
    type: Boolean,
    default: false,
  },
  okText: {
    type: String,
    default: "确认",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
});

const emit = defineEmits("ok", "back", "update:visible");

const handleBack = () => {
  emit("back");
  emit("update:visible", false);
};

const handleOk = () => {
  emit("ok");
};
</script>

<style scoped lang="less">
.page-wrapper {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.arco-page-header) {
    padding: 0;

    .arco-page-header-wrapper {
      padding: 0;
    }

    .arco-page-header-title {
      font-weight: 500;
      font-size: 16px;
      line-height: 30px;
      color: var(--color-text-2);
    }
  }

  .main {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>