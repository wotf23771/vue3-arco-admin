<template>
  <a-form load ref="formRef" :model="form">
    <a-row :gutter="16">
      <a-col span="22">
        <a-form-item field="type" label="类型" label-col-flex="80px" :rules="[{ required: true, message: '类型为空' }]">
          <a-select v-model="form.type" placeholder="请选择" disabled>
            <a-option v-for="item in orgTypeOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col span="22">
        <a-form-item field="name" label="名称" label-col-flex="80px" :rules="[{ required: true, message: '名称为空' }]">
          <a-input v-model="form.name" placeholder="请输入名称" />
        </a-form-item>
      </a-col>
      <a-col span="22">
        <a-form-item field="fullName" label="全称" label-col-flex="80px" :rules="[{ required: true, message: '全称为空' }]">
          <a-input v-model="form.fullName" placeholder="请输入全称" />
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
    </a-row>
  </a-form>
</template>
<script setup>
import { ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { listDictItem } from "@/api/dictApi";
import { getOrg, updateOrg } from "../../api/orgApi";

const formRef = ref();
const emits = defineEmits(["success"]);
const orgTypeOptions = ref([]);
const formId = ref("");
let form = ref({
  name: "",
  fullName: "",
  type: undefined,
  sn: 1,
  isEnabled: 1,
});

// 加载待修改数据
const loadData = async () => {
  const { success, data, message } = await getOrg(formId.value);
  if (success) {
    form.value = data;
    form.value.type = "" + data.type;
  } else {
    Message.error(message || "加载数据失败");
  }
};

// 初始化
const init = (id) => {
  formId.value = id;
  loadData();
  listDictItem("ORG_TYPE").then(res => {
    orgTypeOptions.value = res.data;
  });
};

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    const { success, message } = await updateOrg(formId.value, form.value);
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
