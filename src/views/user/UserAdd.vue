<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col span="11">
          <a-form-item field="account" label="账号" label-col-flex="80px" :rules="[{ required: true, message: '账号为空' }]">
            <a-input v-model="form.account" placeholder="请输入账号" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="name" label="姓名" label-col-flex="80px" :rules="[{ required: true, message: '姓名为空' }]">
            <a-input v-model="form.name" placeholder="请输入姓名" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="mobile" label="手机号" label-col-flex="80px">
            <a-input v-model="form.mobile" placeholder="请输入手机号" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="idNumber" label="身份证号" label-col-flex="80px">
            <a-input v-model="form.idNumber" placeholder="请输入身份证号" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="gender" label="性别" label-col-flex="80px">
            <a-radio-group type="button" v-model="form.gender">
              <a-radio value="1">男</a-radio>
              <a-radio value="2">女</a-radio>
              <a-radio value="9">不确定</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="workPhone" label="工作电话" label-col-flex="80px">
            <a-input v-model="form.workPhone" placeholder="请输入工作电话" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="position" label="职位" label-col-flex="80px">
            <a-input v-model="form.position" placeholder="请输入职位" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="isLocked" label="是否锁定" label-col-flex="80px">
            <a-switch v-model="form.isLocked" type="round" :unchecked-value="0" :checked-value="1" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="sn" label="排序号" label-col-flex="80px">
            <a-input-number v-model="form.sn" :min="1" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>
<script setup>
import { ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { saveUser } from "@/api/userApi";

const formRef = ref();
const loading = ref(false);
const emits = defineEmits(["success"]);
const formId = ref("");
let form = ref({
  account: "",
  name: "",
  gender: undefined,
  mobile: "",
  idNumber: "",
  workPhone: "",
  position: "",
  email: "",
  sn: 1,
  isLocked: 0,
});

// 初始化
const init = () => {
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { code, success, message } = await saveUser(form.value);
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
