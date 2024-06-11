<template>
  <a-spin :loading="loading" class="form-container">
    <a-form load ref="formRef" :model="form">
      <a-row :gutter="16">
        <a-col :span="22">
          <a-form-item field="unionName" label="所属工会" label-col-flex="80px" :rules="[{ required: true, message: '所属工会为空' }]">
            <a-input v-model="form.unionName" placeholder="请选择" @click="handleSelectUnion" @clear.stop="handleClearUnion" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="22">
          <a-form-item field="name" label="角色名称" label-col-flex="80px" :rules="[{ required: true, message: '角色名称为空' }]">
            <a-input v-model="form.name" placeholder="请输入角色名称"/>
          </a-form-item>
        </a-col>
        <a-col :span="22">
          <a-form-item field="code" label="角色编码" label-col-flex="80px" :rules="[{ required: true, message: '角色编码为空' }]">
            <a-input v-model="form.code" placeholder="请输入角色编码" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="22">
          <a-form-item field="dataScopeType" label="数据范围" label-col-flex="80px" :rules="[{ required: true, validator: validatorDataScopeType }]">
            <div style="width: 100%">
              <a-radio-group v-model="form.dataScopeType" direction="vertical">
                <a-radio :value="item.value" v-for="(item, index) in dataScopeTypeOptions" :key="index">{{ item.label }}</a-radio>
              </a-radio-group>
              <div v-if="form.dataScopeType === 4" style="margin-top: 4px">
                <a-input-tag v-model="form.scopeList" :max-tag-count="2" placeholder="请选择" @click="handleSelectSpecifiedUnion"
                             :format-tag="(data) => data.unionName"/>
              </div>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="22">
          <a-form-item field="isEnabled" label="启用状态" label-col-flex="80px">
            <a-switch v-model="form.isEnabled" type="round" :unchecked-value="0" :checked-value="1"/>
          </a-form-item>
        </a-col>
        <a-col :span="22">
          <a-form-item field="sn" label="排序号" label-col-flex="80px">
            <a-input-number v-model="form.sn" :min="1"/>
          </a-form-item>
        </a-col>
        <a-col :span="22">
          <a-form-item field="remark" label="备注" label-col-flex="80px">
            <a-textarea v-model="form.remark" allow-clear/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <union-selector ref="unionSelectorRef" @select="handleUnionSelectorSelect"></union-selector>
    <multi-union-selector ref="multiUnionSelectorRef" @select="handleMultiUnionSelectorSelect"></multi-union-selector>
  </a-spin>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { getRole, updateRole } from "../../api/roleApi";
import UnionSelector from "./components/SingleUnionSelector.vue";
import MultiUnionSelector from "./components/MultiUnionSelector.vue";
import { dataScopeTypeOptions } from "./datas/roleData";

const formRef = ref();
const loading = ref(false);
onMounted(() => {
  console.log("build add mounted");
});
const emits = defineEmits(["success"]);
const formId = ref("");
let form = reactive({
  name: "",
  code: "",
  dataScopeType: 1,
  sn: 1,
  isEnabled: 1,
  unionId: "",
  unionName: "",
  remark: "",
  scopeList: [],
});

const validatorDataScopeType = (value, callback) => {
  switch (value) {
    case 0:
    case 1:
    case 2:
    case 3:
      callback();
      break;
    case 4:
      if (form.scopeList && form.scopeList.length > 0) {
        callback();
      } else {
        callback("请选择指定工会");
      }
      break;
    default:
      callback("数据范围为空");
  }
};

// 加载待修改数据
const loadData = async () => {
  const { success, data, message } = await getRole(formId.value);
  console.log("success", success);
  if (success) {
    Object.assign(form, data);
    if (form.scopeList && form.scopeList.length > 0) {
      form.scopeList.forEach((item) => {
        item.closable = true;
      });
    }
  } else {
    Message.error(message || "加载数据失败");
  }
};

// 初始化
const init = (id) => {
  formId.value = id;
  loadData();
};

const unionSelectorRef = ref();
const handleClearUnion = () => {
  form.unionId = "";
  form.unionName = "";
};
const handleSelectUnion = () => {
  unionSelectorRef.value.init({ title: "选择工会", selected: form.unionId });
};

const handleUnionSelectorSelect = (union) => {
  if (union) {
    form.unionId = union.id;
    form.unionName = union.name;
  }
};

const multiUnionSelectorRef = ref();
const handleSelectSpecifiedUnion = () => {
  const selected = [];
  if (form.scopeList && form.scopeList.length > 0) {
    form.scopeList.forEach((item) => {
      selected.push(item.unionId);
    });
  }
  multiUnionSelectorRef.value.init({ title: "选择工会", selected });
};

const handleMultiUnionSelectorSelect = (unionList) => {
  form.scopeList = [];
  if (unionList && unionList.length > 0) {
    form.scopeList = unionList.map((item) => {
      return {
        closable: true,
        unionId: item.id,
        unionName: item.name,
      };
    });
  }
  formRef.value.validateField("dataScopeType");
};

const handleSubmit = async () => {
  console.log("roleEdit handleSubmit");
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      return false;
    }
    loading.value = true;
    const { success, message } = await updateRole(formId.value, form);
    if (!success) {
      Message.error(message || "更新失败");
      return false;
    }
    Message.success("更新成功");
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
.form-container {
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
