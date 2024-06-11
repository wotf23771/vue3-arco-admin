<template>
  <a-spin :loading="loading">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col span="22">
          <a-form-item field="type" label="所属部门" label-col-flex="80px">
            <a-input v-model="form.orgPath" disabled />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="account" label="账号" label-col-flex="80px" :rules="[{ required: true, message: '账号为空' }]">
            <a-input :disabled="!isMain" v-model="form.account" placeholder="请输入账号" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="name" label="姓名" label-col-flex="80px" :rules="[{ required: true, message: '姓名为空' }]">
            <a-input :disabled="!isMain" v-model="form.name" placeholder="请输入姓名" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="gender" label="性别" label-col-flex="80px" :rules="[{ required: true, message: '性别为空' }]">
            <a-select :disabled="!isMain" v-model="form.gender" placeholder="请选择" allow-clear>
              <a-option v-for="item in genderOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="position" label="职位" label-col-flex="80px">
            <a-input :disabled="!isMain" v-model="form.position" placeholder="请输入职位" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="mobile" label="手机号码" label-col-flex="80px" :rules="[{ required: true, message: '手机号码为空' }]">
            <a-input :disabled="!isMain" v-model="form.mobile" placeholder="请输入手机号码" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="email" label="邮箱" label-col-flex="80px">
            <a-input :disabled="!isMain" v-model="form.email" placeholder="请输入邮箱" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="workPhone" label="工作电话" label-col-flex="80px">
            <a-input :disabled="!isMain" v-model="form.workPhone" placeholder="请输入工作电话" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="idNumber" label="身份证号" label-col-flex="80px">
            <a-input :disabled="!isMain" v-model="form.idNumber" placeholder="请输入身份证号" />
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="isLocked" label="锁定状态" label-col-flex="80px" :rules="[{ required: true, message: '锁定状态为空' }]">
            <a-select :disabled="!isMain" v-model="form.isLocked" placeholder="请选择" allow-clear>
              <a-option v-for="item in isLockedOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="isEnabled" label="启用状态" label-col-flex="80px" :rules="[{ required: true, message: '启用状态为空' }]">
            <a-select :disabled="!isMain" v-model="form.isEnabled" placeholder="请选择" allow-clear>
              <a-option v-for="item in isEnabledOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="11">
          <a-form-item field="sn" label="排序号" label-col-flex="80px" :rules="[{ required: true, message: '排序号为空' }]">
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
import { listDictItems } from "@/api/dictApi";
import { getOrgUser, updateOrgUser } from "../../api/orgUserApi";

const orgId = ref("");
const userId = ref("");
const formRef = ref();
const loading = ref(false);

const emits = defineEmits(["success"]);
const genderOptions = ref([]);
const isEnabledOptions = ref([]);
const isLockedOptions = ref([]);
const isMain = ref(false);
const form = ref({
  orgPath: "",
  account: "",
  name: "",
  gender: "",
  mobile: "",
  email: "",
  position: "",
  workPhone: "",
  isLocked: "0",
  isEnabled: "1",
  sn: 1,
});

// 加载待修改数据
const loadData = async () => {
  const { success, data, message } = await getOrgUser(orgId.value, userId.value);
  if (success) {
    form.value = data;
    if (form.value.isMain == 1) {
      isMain.value = true;
    }
  } else {
    Message.error(message || "加载数据失败");
  }
};

// 初始化
const init = (_orgId, _userId) => {
  orgId.value = _orgId;
  userId.value = _userId;
  loadData();
  listDictItems(["gender", "IS_LOCKED", "IS_ENABLED"]).then(res => {
    if (res.data) {
      genderOptions.value = res.data["gender"];
      isEnabledOptions.value = res.data["IS_ENABLED"];
      isLockedOptions.value = res.data["IS_LOCKED"];
    }
  });
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { success, message } = await updateOrgUser(orgId.value, userId.value, form.value);
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
