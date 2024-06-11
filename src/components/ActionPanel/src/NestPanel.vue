<template>
  <div class="page-wrapper" v-if="visible">
    <a-page-header v-if="!nest" @back="handleBack" title="返回"/>
    <div class="main">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  nest: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits("back", "update:visible");

const handleBack = () => {
  emit("back");
  emit("update:visible", false);
};
</script>

<style scoped lang="less">
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.arco-page-header) {
    padding: 10px 0 0 20px;

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
  }
}
</style>