<template>
  <a-form load ref="formRef" :model="form">
    <a-row :gutter="16">
      <a-col :span="22">
        <a-form-item field="name" label="配置名称" label-col-flex="80px" :rules="[{ required: true, message: '配置名称为空' }]">
          <a-input v-model="form.name" placeholder="请输入配置名称" />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item field="code" label="配置编码" label-col-flex="80px" :rules="[{ required: true, message: '配置编码为空' }]">
          <a-input v-model="form.code" placeholder="请输入配置编码" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item field="code" label="配置内容" label-col-flex="80px" :rules="[{ required: true, message: '配置内容为空' }]">
          <a-input v-model="form.value" placeholder="请输入配置内容" />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item field="sn" label="排序号" label-col-flex="80px">
          <a-input-number v-model="form.sn" :min="1" />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item field="isEnabled" label="启用状态" label-col-flex="80px">
          <a-switch v-model="form.isEnabled" type="round" :unchecked-value="0" :checked-value="1" />
        </a-form-item>
      </a-col>
      <a-col :span="22">
        <a-form-item field="remark" label="备注" label-col-flex="80px">
          <a-textarea v-model="form.remark" allow-clear />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script lang="ts" setup>
import { Message } from "@arco-design/web-vue";
import { reactive, ref } from "vue";
import { getConfig, updateConfig } from "../api";

const formRef = ref();
const emits = defineEmits(["success"]);
const formId = ref("");
let form = reactive({
  name: "",
  code: "",
  value: "",
  sn: 1,
  isEnabled: 1,
  remark: "",
});

// 加载待修改数据
const loadData = async () => {
  const { success, data, message } = await getConfig(formId.value);
  if (success) {
    Object.assign(form, data);
    console.log(form);
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
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    const { success, message } = await updateConfig(formId.value, form);
    if (!success) {
      Message.error(message || "更新失败");
      return false;
    }
    Message.success("更新成功");
    emits("success");
    return true;
  } catch (err) {
    return false;
  }
};

defineExpose({ init, handleSubmit });
</script>

<style scoped lang="less">

</style>
