<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form" >
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="appName"  label="应用名称" label-col-flex="120px" >
            <a-input disabled v-model="form.appName" placeholder="请输入应用名称" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="procInstName" label="事项" label-col-flex="120px" >
            <a-input disabled v-model="form.procInstName" placeholder="请输入应用标识" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="taskName" label="任务名称" label-col-flex="120px">
            <a-input disabled v-model="form.taskName" placeholder="请输入应用密钥"/>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="callbackDate" label="回调时间" label-col-flex="120px">
            <a-input disabled v-model="form.callbackDate"   />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="callbackType" label="回调类型" label-col-flex="120px">
            <a-select disabled  v-model="form.callbackType" placeholder="请选择" allow-clear>
              <a-option  value="1" label="流程回调"></a-option>
              <a-option  value="2" label="任务回调"></a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="callbackUrl" label="流程地址" label-col-flex="120px">
            <a-input disabled v-model="form.callbackUrl" />
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="callbackData" label="回调参数" label-col-flex="120px">
            <a-textarea disabled v-model="form.callbackData"  />
          </a-form-item>
        </a-col>
        
      </a-row>
    </a-form>
  </a-spin>
  
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { getAppCallbackLogById } from "@/api/app/hooklog";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);

const id = ref('');
const form = reactive({
  appName: '', //应用名称
  procInstName:'',
  taskName: '',
  callbackDate: '',
  callbackType: '',
  callbackUrl: '',
  callbackData: '',
 
});

onMounted(() => {
 
});
const emits = defineEmits(["success"]);
const initdata = async (record) => {
  console.log(" initdata",record.id);
  id.value = record.id;

  const { success, data, message } = await getAppCallbackLogById(id.value);
  if (success) {
     form.appName = data.appName;
    form.procInstName = data.procInstName;
    form.taskName = data.taskName;
    form.callbackDate = data.callbackDate;
    form.callbackType = data.callbackType;
    form.callbackUrl = data.callbackUrl;
    form.callbackData = data.callbackData;
    
  } else {
    Message.error(message || "加载数据失败");
  }
}



defineExpose({
  initdata,

});
</script>

<style scoped lang="less">

</style>
