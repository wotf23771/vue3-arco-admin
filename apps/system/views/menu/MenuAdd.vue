<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="name" label="上级菜单" label-col-flex="80px">
            <a-input v-model="parentName" disabled />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="name" label="菜单名称" label-col-flex="80px" :rules="[{ required: true, message: '菜单名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入菜单名称" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="code" label="菜单编码" label-col-flex="80px" :rules="[{ required: true, message: '配置菜单为空' }]">
            <a-input v-model="form.code" placeholder="请输入菜单编码" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="path" label="访问路径" label-col-flex="80px" :rules="[{ required: true, message: '访问路径为空' }]">
            <a-input v-model="form.path" placeholder="请输入访问路径" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="icon" label="菜单图标" label-col-flex="80px">
            <a-input v-model="form.icon" placeholder="请输入选择菜单图标" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="isVisible" label="是否显示" label-col-flex="80px">
            <a-switch v-model="form.isVisible" type="round" :unchecked-value="0" :checked-value="1" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="isPublic" label="是否公共" label-col-flex="80px">
            <a-switch v-model="form.isPublic" type="round" :unchecked-value="0" :checked-value="1" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="isEnabled" label="启用状态" label-col-flex="80px">
            <a-switch v-model="form.isEnabled" type="round" :unchecked-value="0" :checked-value="1" />
          </a-form-item>
        </a-col>
        <a-col span="11">
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
  </a-spin>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { saveMenu } from "../../api/menuApi";

const parentId = ref("");
const parentName = ref("");
const formRef = ref();
const loading = ref(false);
onMounted(() => {
  console.log("build add mounted");
});
const emits = defineEmits(["success"]);

const form = reactive({
  name: "",
  code: "",
  path: "",
  icon: "",
  isVisible: 1,
  isPublic: 0,
  isEnabled: 1,
  sn: 1,
  remark: "",
});
// 初始化
const init = (pId, pName) => {
  parentId.value = pId;
  parentName.value = pName;
};
const handleSubmit = async () => {
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { success, message } = await saveMenu(parentId.value, form);
    if (!success) {
      Message.error(message || "保存失败");
      return false;
    }
    Message.success("保存成功");
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
