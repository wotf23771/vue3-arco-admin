<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form" >
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="appName"  label="应用名称" label-col-flex="80px" :rules="[{ required: true, message: '应用名称为空' }]">
            <a-input v-model="form.appName" placeholder="请输入应用名称" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="appId" label="应用id" label-col-flex="80px" :rules="[{ required: true, message: '应用id为空' }]">
            <a-input v-model="form.appId" placeholder="请输入应用id" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="appSecret" label="应用密钥" label-col-flex="80px" :rules="[{ required: true, message: '应用密钥为空' }]">
            <a-input v-model="form.appSecret" placeholder="请输入应用密钥"/>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="pcHost" label="PC端地址" label-col-flex="80px">
            <a-input v-model="form.pcHost" placeholder="请输入PC端地址"  />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="mobileHost" label="移动端地址" label-col-flex="80px">
            <a-input v-model="form.mobileHost" placeholder="请输入移动端地址" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="procCallback" label="流程事件回调地址" label-col-flex="80px">
            <a-input v-model="form.procCallback" placeholder="请输入流程事件回调地址" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="taskCallback" label="任务事件回调地址" label-col-flex="80px">
            <a-input v-model="form.taskCallback" placeholder="请输入任务事件回调地址" />
          </a-form-item>
        </a-col>
        <a-col span="22">     
          <a-form-item field="remark" label="备注" label-col-flex="80px">
            <a-input v-model="form.remark" placeholder="请输入备注" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
  
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { saveApp } from "@/api/app/app";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);

const form = reactive({
  appName: '', //应用名称
  appId: '',   //应用ID
  appSecret: '',
  pcHost: '',
  mobileHost: '',
  procCallback: '',
  taskCallback: '',
  remark: '',
});

onMounted(() => {
  console.log("app add mounted");
});

const emits = defineEmits(["success"]);

const handleSubmit = async ()=>{
  console.log("app add handleSubmit",form);
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { code, success, message } = await saveApp(form);
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


});
</script>

<style scoped lang="less">

</style>
