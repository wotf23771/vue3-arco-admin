<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="name" label="权限名称" label-col-flex="80px" :rules="[{ required: true, message: '权限名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入权限名称" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="code" label="权限编码" label-col-flex="80px" :rules="[{ required: true, message: '权限编码为空' }]">
            <a-input v-model="form.code" placeholder="请输入权限编码" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="sn" label="排序号" label-col-flex="80px">
            <a-input-number v-model="form.sn" :min="1" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script setup>
import { ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { getMenuPerm, updateMenuPerm } from "../../api/menuApi";

const formRef = ref();
const loading = ref(false);

const emits = defineEmits(["success"]);
const formId = ref("");
let form = ref({
  name: "",
  code: "",
  sn: 1,
});

// 加载待修改数据
const loadData = async () => {
  const { success, data, message } = await getMenuPerm(formId.value);
  if (success) {
    form.value = data;
  } else {
    Message.error(message || "加载数据失败");
  }
};

// 初始化
const init = (id) => {
  formId.value = id;
  loadData();
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { success, message } = await updateMenuPerm(formId.value, form.value);
    if (!success) {
      Message.error(message || "更新失败");
      return false;
    }
    Message.success("更新成功");
    emits("success");
    return true;
  } catch (err) {
    loading.value = false;
    return false;
  } finally {
    loading.value = false;
  }
};

defineExpose({ init, handleSubmit });
</script>

<style scoped lang="less">

</style>
