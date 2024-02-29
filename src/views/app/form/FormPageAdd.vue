<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form" @submit="handleSubmit">
      <a-row :gutter="16">
      
        <a-col span="22">
          <a-form-item field="name" label="页面名称" label-col-flex="80px" :rules="[{ required: true, message: '页面名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入页面名称"/>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="url" label="页面地址" label-col-flex="80px" :rules="[{ required: true, message: '页面地址为空' }]">
            <a-input v-model="form.url" placeholder="请输入页面地址"/>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="sn" label="排序号" label-col-flex="80px">
            <a-input-number v-model="form.sn" placeholder="请输入排序号"  />
          </a-form-item>
        </a-col>
      </a-row> 
    </a-form>
  </a-spin>
  
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { saveFormPage } from "@/api/app/form";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);

const form = reactive({
  formId: '',   //表单ID
  name: '',
  url: '',
  sn: 1,
 
});
const emits = defineEmits(["success"]);
onMounted(() => {
  
 
});
const init = (formId) => {
  console.log("app add init",formId);
  form.formId = formId;

};

const handleSubmit = async ()=>{
  console.log("form add handleSubmit",form);

  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { code, success, message } = await saveFormPage(form);
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
}


defineExpose({
  handleSubmit,
  init

});
</script>

<style scoped lang="less">

</style>
