<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form" @submit="handleSubmit">
      <a-row :gutter="16">
        
        <a-col span="22">
          <a-form-item field="code" label="属性编码" label-col-flex="80px" :rules="[{ required: true, message: '属性编码为空' }]">
            <a-input v-model="form.code" placeholder="请输入属性编码" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="name" label="属性名称" label-col-flex="80px" :rules="[{ required: true, message: '属性名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入属性名称"/>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="dataType" label="数据类型" label-col-flex="80px" :rules="[{ required: true, message: '数据类型为空' }]">
            <a-select  v-model="form.dataType" placeholder="请选择数据类型" >
                    <a-option value="date" label="日期"></a-option>
                    <a-option value="number" label="数字"></a-option>
                    <a-option value="text" label="文本"></a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row> 
    </a-form>
  </a-spin>
  
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { saveFormProperty } from "@/api/app/form";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);

const form = reactive({
  formId: '',   //表单ID
  code: '',
  name: '',
  dataType: '',
 
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
    const { code, success, message } = await saveFormProperty(form);
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
