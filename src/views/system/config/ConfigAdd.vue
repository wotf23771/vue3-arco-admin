<template>
  add
</template>
<script setup>
import { onMounted } from "vue";

onMounted(() => {
  console.log("config add mounted");
});

const handleSubmit = () => {
  console.log("handleSubmit");
};

defineExpose({ handleSubmit });
</script>

<style scoped lang="less">

</style>
