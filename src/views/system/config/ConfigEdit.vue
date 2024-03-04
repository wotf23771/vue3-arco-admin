<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item
              field="scopeType"
              label="配置范围"
              label-col-flex="80px"
              :rules="[{ required: true, message: '配置范围为空' }]"
          >
            <a-radio-group type="button" v-model="form.scopeType" disabled>
              <a-radio value="DEFAULT">全局</a-radio>
              <a-radio value="UNIT">单位</a-radio>
              <a-radio value="USER">用户</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="name" label="参数名称" label-col-flex="80px" :rules="[{ required: true, message: '参数名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入参数名称" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="code" label="参数编码" label-col-flex="80px" :rules="[{ required: true, message: '参数编码为空' }]">
            <a-input v-model="form.code" placeholder="请输入参数编码" disabled />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="value1" label="配置类型" label-col-flex="80px">
            <a-radio-group type="button" v-model="form.type" disabled>
              <a-radio value="VALUE">固定配置</a-radio>
              <a-radio value="LIST">列表配置</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="value1" label="排序号" label-col-flex="80px">
            <a-input-number v-model="form.sn" :min="1" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="value1" label="是否启用" label-col-flex="80px">
            <a-switch v-model="form.isEnabled" type="round" :unchecked-value="0" :checked-value="1" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getConfig, updateConfig } from "@/api/system/config";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);
onMounted(() => {
  console.log("build add mounted");
});
const emits = defineEmits(["success"]);
const formId = ref("");
let form = ref({
  scopeType: "DEFAULT",
  name: "",
  code: "",
  type: "VALUE",
  sn: 1,
  isEnabled: 1,
});

// 加载待修改数据
const loadData = async () => {
  const { success, data, message } = await getConfig(formId.value);
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
  console.log("configEdit handleSubmit");
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { code, success, message } = await updateConfig(formId.value, form.value);
    if (!success) {
      Message.error(message || "更新失败");
      return false;
    }
    Message.success("更新成功");
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
