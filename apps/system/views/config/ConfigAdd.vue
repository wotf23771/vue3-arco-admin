<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="name" label="配置名称" label-col-flex="80px" :rules="[{ required: true, message: '配置名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入配置名称" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="code" label="配置编码" label-col-flex="80px" :rules="[{ required: true, message: '配置编码为空' }]">
            <a-input v-model="form.code" placeholder="请输入配置编码" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="code" label="配置内容" label-col-flex="80px" :rules="[{ required: true, message: '配置内容为空' }]">
            <a-input v-model="form.value" placeholder="请输入配置内容" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="sn" label="排序号" label-col-flex="80px">
            <a-input-number v-model="form.sn" :min="1" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="isEnabled" label="启用状态" label-col-flex="80px">
            <a-switch v-model="form.isEnabled" type="round" :unchecked-value="0" :checked-value="1" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="remark" label="备注" label-col-flex="80px">
            <a-textarea v-model="form.remark" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { saveConfig } from "../../api/configApi";

const formRef = ref();
const loading = ref(false);
onMounted(() => {
  console.log("build add mounted");
});
const emits = defineEmits(["success"]);

const form = reactive({
  name: "",
  code: "",
  sn: 1,
  value: "",
  isEnabled: 1,
  remark: "",

});

const handleSubmit = async () => {
  console.log("configAdd handleSubmit");
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { success, message } = await saveConfig(form);
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

defineExpose({ handleSubmit });
</script>

<style scoped lang="less">

</style>
