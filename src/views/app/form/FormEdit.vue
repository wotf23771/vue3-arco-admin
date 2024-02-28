<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form" @submit="handleSubmit">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="appId"  label="所属应用" label-col-flex="80px" :rules="[{ required: true, message: '请选择应用' }]">
            <a-select  v-model="form.appId" placeholder="请选择" allow-clear>
                <a-option :key="app.appId" v-for="app of appDataList" :value="app.appId" :label="app.appName"></a-option>              
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="code" label="表单编码" label-col-flex="80px" :rules="[{ required: true, message: '表单编码为空' }]">
            <a-input v-model="form.code" placeholder="请输入表单编码" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="name" label="表单名称" label-col-flex="80px" :rules="[{ required: true, message: '表单名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入表单名称"/>
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
import { appList } from "@/api/app/app";
import { getForm,updateForm } from "@/api/app/form";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);

const id = ref('');
const form = reactive({
  appName: '', //应用名称
  appId: '',   //应用ID
  code: '',
  name: '',
  sn: 1,
  version:''
});
const emits = defineEmits(["success"]);
onMounted(() => {
  console.log("app add mounted");
  loadAppList();
});
const initdata = async (record) => {
  console.log("app initdata",record.id);
  id.value = record.id;

  const { success, data, message } = await getForm(id.value);
  if (success) {
     form.appName = data.appName;
    form.appId = data.appId;
    form.code = data.code;
    form.name = data.name;
    form.sn = data.sn;
    form.version = data.version;
  } else {
    Message.error(message || "加载数据失败");
  }
}
const appDataList = ref([]);
const loadAppList = () => {
  appList().then((res) => {
    appDataList.value = res.data;
  });
};

const handleSubmit = async ()=>{
  console.log("form add handleSubmit",form);
  if (form.appId) {
    appDataList.value.forEach((item) => {
      if (item.appId === form.appId) {
        form.appName = item.appName;
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
    const { code, success, message } = await updateForm(id.value,form);
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
  initdata

});
</script>

<style scoped lang="less">

</style>
