<template>
  <a-form load ref="formRef" :model="form">
    <a-row :gutter="16">
      <a-col span="22">
        <a-form-item field="name" label="字典名称" label-col-flex="80px" :rules="[{ required: true, message: '字典名称为空' }]">
          <a-input v-model="form.name" placeholder="请输入字典名称" />
        </a-form-item>
      </a-col>
      <a-col span="22">
        <a-form-item field="type" label="字典类型" label-col-flex="80px" :rules="[{ required: true, message: '字典类型为空' }]">
          <a-input v-model="form.type" placeholder="请输入字典类型" />
        </a-form-item>
      </a-col>
      <a-col span="22">
        <a-form-item field="isEnabled" label="启用状态" label-col-flex="80px">
          <a-switch v-model="form.isEnabled" type="round" :unchecked-value="0" :checked-value="1" />
        </a-form-item>
      </a-col>
      <a-col span="22">
        <a-form-item field="sn" label="排序号" label-col-flex="80px">
          <a-input-number v-model="form.sn" :min="1" />
        </a-form-item>
      </a-col>
      <a-col span="22">
        <a-form-item field="remark" label="备注" label-col-flex="80px">
          <a-textarea v-model="form.remark" allow-clear />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup>
import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { saveType } from "../../api/dictApi";

const formRef = ref();
const emits = defineEmits(["success"]);
const form = reactive({
  name: "",
  type: "",
  sn: 1,
  isEnabled: 1,
  remark: "",
});

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    const { success, message } = await saveType(form);
    if (!success) {
      Message.error(message || "保存失败");
      return false;
    }
    Message.success("保存成功");
    emits("success");
    return true;
  } catch (err) {
    return false;
  }
};

defineExpose({ handleSubmit });
</script>

<style scoped lang="less">

</style>
