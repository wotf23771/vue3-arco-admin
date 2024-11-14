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
import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { saveMenuPerm } from "../../api/menuApi";

const menuId = ref("");
const formRef = ref();
const loading = ref(false);

const emits = defineEmits(["success"]);

const form = reactive({
  name: "",
  code: "",
  sn: 1,

});
// 初始化
const init = (id) => {
  menuId.value = id;
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { success, message } = await saveMenuPerm(menuId.value, form);
    if (!success) {
      Message.error(message || "保存失败");
      return false;
    }
    Message.success("保存成功");
    emits("success");
    return true;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
    return false;
  } finally {
    loading.value = false;
  }
};

defineExpose({ init, handleSubmit });
</script>

<style scoped lang="less">

</style>
