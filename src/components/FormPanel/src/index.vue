<template>
  <a-card class="form-panel-card" :bordered="false">
    <template v-if="title" #title>
      <div class="form-panel-card-title">
        <span class="prefix" :style="color ? { backgroundColor: color } : {}"></span>
        <span class="title-span">{{ title }}</span>
      </div>
    </template>
    <template #extra>
      <slot name="extra"></slot>
    </template>
    <div>
      <slot></slot>
    </div>
  </a-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
});
</script>

<style scoped lang="less">
.form-panel-card {
  :deep(.arco-card-header) {
    padding: 10px 6px;
  }

  .form-panel-card-title {
    display: flex;
    align-items: center;
    font-size: 14px;

    .prefix {
      display: flex;
      width: 4px;
      height: 14px;
      border-radius: 1px;
      margin-right: 5px;
      background: rgb(var(--primary-5));
    }
  }
}
</style>