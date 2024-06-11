<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="type" label="类型" label-col-flex="80px" :rules="[{ required: true, message: '类型为空' }]">
            <a-select v-model="form.type" placeholder="请选择" allow-clear>
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
  </a-spin>
</template>
<script setup>
import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { listDictItem } from "@/api/dictApi";
import { saveOrg } from "../../api/orgApi";

const parentId = ref("");
const formRef = ref();
const loading = ref(false);

const emits = defineEmits(["success"]);
const orgTypeOptions = ref([]);
const form = reactive({
  name: "",
  fullName: "",
  type: undefined,
  sn: 1,
  isEnabled: 1,
});
// 初始化
const init = (id) => {
  parentId.value = id;
  listDictItem("ORG_TYPE").then(res => {
    orgTypeOptions.value = res.data;
  });
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { success, message } = await saveOrg(parentId.value, form);
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
