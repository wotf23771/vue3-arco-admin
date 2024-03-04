<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form" @submit="handleSubmit">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="appId"  label="所属应用" label-col-flex="120px" :rules="[{ required: true, message: '请选择应用' }]">
            <a-select  v-model="form.appId"  placeholder="请选择" @change="handleAppSelectChange" allow-clear>
                <a-option :key="item.appId" v-for="item of appDataList" :value="item.appId" :label="item.appName"></a-option>              
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="formId"  label="关联表单" label-col-flex="120px" :rules="[{ required: true, message: '请选择表单' }]">
            <a-select  v-model="form.formId" placeholder="请选择" allow-clear>
                <a-option :key="item.id" v-for="item of formDataList" :value="item.id" :label="item.name"></a-option>              
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="name" label="流程定义名称" label-col-flex="120px" :rules="[{ required: true, message: '流程定义名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入流程定义名称" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="procDefKey" label="流程定义KEY" label-col-flex="120px" :rules="[{ required: true, message: '流程定义KEY为空' }]">
            <a-input v-model="form.procDefKey" placeholder="请输入流程定义KEY"/>
          </a-form-item>
        </a-col>
        
      </a-row> 
    </a-form>
  </a-spin>
  
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { appList } from "@/api/app/app";
import { listForm } from "@/api/app/form";
import { saveProcDef } from "@/api/def/config";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);

const form = reactive({
  appName: '', //应用名称
  appId: '',   //应用ID
  formId:'',
  formName: '',
  formCode: '',
  procDefKey: '',
  name: '',
  sn: 1,
 
});
const emits = defineEmits(["success"]);
onMounted(() => {
  console.log("app add mounted");
  loadAppList();
});
const appDataList = ref([]);
const loadAppList = () => {
  appList().then((res) => {
    appDataList.value = res.data;
  });
};
const handleAppSelectChange= (appId)=>{
  console.log("handleAppSelectChange",appId);
  form.formId = '';
  // 查询应用下所属表单
  if (appId) {
    listForm(appId).then((res) => {
      formDataList.value = res.data;
    });
  }else{
    formDataList.value = [];
  }
  
}

const formDataList = ref([]);


const handleSubmit = async ()=>{
  console.log("form add handleSubmit",form);
  if (form.appId) {
    appDataList.value.forEach((item) => {
      if (item.appId === form.appId) {
        form.appName = item.appName;
      }
    });
  }
  if (form.formId ) {
    formDataList.value.forEach((item) => {
      if (item.id === form.formId) {
        form.formName = item.name;
        form.formCode = item.code;
      }
    });
  }


  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { code, success, message } = await saveProcDef(form);
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
