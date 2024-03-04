<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form" @submit="handleSubmit">
      <a-row :gutter="16">
      
        <a-col span="22">
          <a-form-item field="name" label="规则名称" label-col-flex="120px" :rules="[{ required: true, message: '规则名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入规则名称"/>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="userRuleBean"  label="候选人规则" label-col-flex="120px" :rules="[{ required: true, message: '请选择候选人规则' }]">
            <a-select  v-model="form.userRuleBean" placeholder="请选择" allow-clear>
                <a-option :key="item.rule" v-for="item of ruleList" :value="item.rule" :label="item.name"></a-option>              
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="userRuleParams" label="规则参数" label-col-flex="120px" >
            <a-textarea v-model="form.userRuleParams" placeholder="请输入候选人规则参数"/>
          </a-form-item>
        </a-col>
        <a-col span="22">
          <a-form-item field="sn" label="排序号" label-col-flex="120px">
            <a-input-number v-model="form.sn" placeholder="请输入排序号"  />
          </a-form-item>
        </a-col>
      </a-row> 
    </a-form>
  </a-spin>
  
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { listRule, getFormUserRule, updateFormUserRule } from "@/api/app/form";
import { Message } from "@arco-design/web-vue";

const formRef = ref();
const loading = ref(false);
const id = ref('');
const form = reactive({
  formId: '',   //表单ID
  name: '',
  userRuleBean: '',
  userRuleName: '',
  userRuleParams: '',
  sn: '',
  version:''
});
const emits = defineEmits(["success"]);
onMounted(() => {
  loadRuleList();
});
const ruleList = ref([]);
const loadRuleList = () => {
  listRule().then((res) => {
    ruleList.value = res.data;
  });
};
const init = async (record) => {
  id.value = record.id;
  const { success, data, message } = await getFormUserRule(id.value);
  if (success) {
    form.formId = data.formId
    form.name = data.name;
    form.userRuleBean = data.userRuleBean;
    form.userRuleName = data.userRuleName;
    form.userRuleParams = data.userRuleParams;
    form.sn = data.sn;
    form.version = data.version;
  } else {
    Message.error(message || "加载数据失败");
  }
};

const handleSubmit = async ()=>{
  console.log("form user rule handleSubmit",form);

  if (form.userRuleBean) {
    ruleList.value.forEach((item) => {
      if (item.rule === form.userRuleBean) {
        form.userRuleName = item.name;
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
    const { code, success, message } = await updateFormUserRule(id.value,form);
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
}


defineExpose({
  handleSubmit,
  init

});
</script>

<style scoped lang="less">

</style>
