<template>
  <a-modal v-model:visible="visible" title-align="start" draggable @close="() => { visible = false; loading = false; }">
    <template #title>
      <icon-edit />
      配置全局固定配置
    </template>
    <a-spin :loading="loading">
      <a-form load ref="formRef" :model="form">
        <a-row :gutter="16">
          <a-col span="22">
            <a-form-item field="name" label="参数名称" label-col-flex="80px">
              <a-input v-model="form.configName" placeholder="请输入参数名称" disabled />
            </a-form-item>
          </a-col>
          <a-col span="22">
            <a-form-item field="code" label="参数编码" label-col-flex="80px">
              <a-input v-model="form.configCode" placeholder="请输入参数编码" disabled />
            </a-form-item>
          </a-col>
          <a-col span="22">
            <a-form-item field="value" label="固定值" label-col-flex="80px" :rules="[{ required: true, message: '固定值为空' }]">
              <a-input v-model="form.value" placeholder="请输入固定值" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template #footer>
      <a-button @click="()=>{ visible = false; loading = false; }">取消</a-button>
      <a-popconfirm content="确定要保存？" @ok="handleSubmit">
        <a-button type="primary" :loading="loading">保存</a-button>
      </a-popconfirm>
    </template>
  </a-modal>
</template>
<script setup>
import { ref } from "vue";
import { getConfigValue, updateConfigValue } from "@/api/system/config";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const visible = ref(false);
const formRef = ref();
const configId = ref("");
const form = ref({
  configName: "",
  configCode: "",
  value: "",
});

const emits = defineEmits(["success"]);

// 初始化
const init = (record) => {
  visible.value = true;
  configId.value = record.id;
  form.value.configName = record.name;
  form.value.configCode = record.code;
  form.value.value = "";
  formRef.value.clearValidate();
  loadData();
};

const loadData = async () => {
  const { success, data = {}, message } = await getConfigValue(configId.value, "DEFAULT");
  if (success) {
    form.value.value = data.value;
  } else {
    Message.error(message || "加载数据失败");
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    const { code, success, message } = await updateConfigValue(configId.value, "DEFAULT", form.value.value);
    if (!success) {
      Message.error(message || "保存失败");
      return false;
    } else {
      Message.success("保存成功");
    }
    visible.value = false;
    emits("success");
    return true;
  } catch (err) {
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

defineExpose({ init });
</script>

<style scoped lang="less">

</style>
