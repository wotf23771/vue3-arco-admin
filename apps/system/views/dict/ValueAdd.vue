<template>
  <a-form load ref="formRef" :model="form">
    <a-row :gutter="16">
      <a-col span="22">
        <a-form-item field="value" label="字典值" label-col-flex="80px" :rules="[{ required: true, message: '字典值为空' }]">
          <a-input v-model="form.value" placeholder="请输入字典值" />
        </a-form-item>
      </a-col>
      <a-col span="22">
        <a-form-item field="text" label="字典文本" label-col-flex="80px" :rules="[{ required: true, message: '字典文本为空' }]">
          <a-input v-model="form.text" placeholder="请输入字典文本" />
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
import { saveValue } from "../../api/dictApi";

const typeId = ref("");
const formRef = ref();
const emits = defineEmits(["success"]);
const form = reactive({
  text: "",
  value: "",
  sn: 1,
  isEnabled: 1,
  remark: "",
});
// 初始化
const init = (id) => {
  typeId.value = id;
};
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    const { success, message } = await saveValue(typeId.value, form);
    if (!success) {
      Message.error(message || "保存失败");
      return false;
    }
    Message.success("保存成功");
    emits("success");
    return true;
  } catch (err) {
    console.log("err", err);
    return false;
  }
};

defineExpose({ init, handleSubmit });
</script>

<style scoped lang="less">

</style>
