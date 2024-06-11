<template>
  <div class="perm-container">
    <a-table
        row-key="menuId"
        :loading="loading"
        :pagination="false"
        :data="tableData"
        :expandable="{expandedRowKeys: expandedRowKeys, width: 1}"
        @expand="handleExpend"
        column-resizable
        :bordered="{cell:true}"
    >
      <template #columns>
        <a-table-column title="菜单" data-index="menuName" align="left" :width="200"></a-table-column>
        <a-table-column title="权限">
          <template #cell="{ record, rowIndex }">
            <div v-if="record.permList && record.permList.length > 0" class="perm-list">
              <div class="perm-item">
                <a-checkbox v-model="record.hasAllPerm" @change="handleCheckAll(record)">全选</a-checkbox>
              </div>
              <div v-for="(perm, index) in record.permList" :key="index" class="perm-item">
                <a-checkbox v-model="perm.hasPerm" @change="handleCheckItem(record)">{{ perm.permName }}</a-checkbox>
                <div class="data-scope" v-if="perm.hasPerm">
                  <a-radio-group v-model="perm.dataScopeType">
                    <a-radio :value="item.value" v-for="(item, i) in dataScopeTypeOptions" :key="i">
                      {{ item.label }}
                    </a-radio>
                  </a-radio-group>
                  <div v-if="perm.dataScopeType === 4" class="data-scope-selector">
                    <a-input-tag
                        v-model="perm.scopeList"
                        :max-tag-count="3"
                        placeholder="请选择"
                        @click="handleSelectSpecifiedUnion(perm)"
                        :format-tag="(data) => data.unionName"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <multi-union-selector ref="multiUnionSelectorRef" @select="handleMultiUnionSelectorSelect"></multi-union-selector>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { loadRoleMenuTree, saveRoleMenuPerm } from "../../api/roleApi";
import { Message } from "@arco-design/web-vue";
import { dataScopeTypeOptions } from "./datas/roleData";
import MultiUnionSelector from "./components/MultiUnionSelector.vue";
import cloneDeep from "lodash-es/cloneDeep";

const loading = ref(false);
const emits = defineEmits(["success"]);

const roleId = ref("");
const tableData = ref([]);
const expandedRowKeys = ref([]);

const handleExpend = (rowKey, record) => {
  if (expandedRowKeys.value.includes(rowKey)) {
    expandedRowKeys.value.splice(expandedRowKeys.value.indexOf(rowKey), 1);
  } else {
    expandedRowKeys.value.push(rowKey);
  }
};

const handleCheckAll = (record) => {
  if (record.hasAllPerm) {
    record.permList.forEach((perm) => {
      perm.hasPerm = true;
    });
  } else {
    record.permList.forEach((perm) => {
      perm.hasPerm = false;
    });
  }
};

const handleCheckItem = (record) => {
  record.hasAllPerm = record.permList.every((perm) => perm.hasPerm);
};

const multiUnionSelectorRef = ref();
let tempPerm = {};
const handleSelectSpecifiedUnion = (perm) => {
  const selected = [];
  tempPerm = perm;
  if (perm.scopeList && perm.scopeList.length > 0) {
    perm.scopeList.forEach((item) => {
      selected.push(item.unionId);
    });
  }
  multiUnionSelectorRef.value.init({ title: "选择工会", selected });
};

const handleMultiUnionSelectorSelect = (unionList) => {
  tempPerm.scopeList = [];
  if (unionList && unionList.length > 0) {
    tempPerm.scopeList = unionList.map((item) => {
      return {
        closable: true,
        unionId: item.id,
        unionName: item.name,
      };
    });
  }
};

const addExpendedRowKeys = (list) => {
  if (!list || list.length === 0) {
    return;
  }
  for (const item of list) {
    if (item.children && item.children.length > 0) {
      expandedRowKeys.value.push(item.menuId);
      addExpendedRowKeys(item.children);
    }
    if (item.permList && item.permList.length > 0) {
      item.permList.forEach((perm) => {
        if (perm.scopeList && perm.scopeList.length > 0) {
          perm.scopeList.forEach((scope) => {
            scope.closable = true;
          });
        }
      });
    }
  }
};

const loadData = async () => {
  loading.value = true;
  const { success, data, message } = await loadRoleMenuTree(roleId.value);
  if (success) {
    tableData.value = data;
    expandedRowKeys.value = [];
    addExpendedRowKeys(tableData.value);
  } else {
    Message.error(message || "加载数据失败");
  }
  loading.value = false;
};

const validatorData = (dataList) => {
  let valid = true;
  let errMsg;
  const formData = [];
  if (dataList && dataList.length > 0) {
    for (let item of dataList) {
      if (!valid) {
        break;
      }
      if (item.permList && item.permList.length > 0) {
        for (let perm of item.permList) {
          if (!perm.hasPerm) {
            continue;
          }
          if (perm.dataScopeType === null || perm.dataScopeType === undefined) {
            valid = false;
            errMsg = `【${item.menuName}-${perm.permName}】数据范围不能为空`;
            break;
          }
          if (perm.dataScopeType === 4 && (!perm.scopeList || perm.scopeList.length === 0)) {
            valid = false;
            errMsg = `【${item.menuName}-${perm.permName}】数据范围不能为空`;
            break;
          }
          const permData = cloneDeep(perm);
          permData.menuId = item.menuId;
          permData.menuName = item.menuName;
          formData.push(permData);
        }
      }
      if (valid && item.children && item.children.length > 0) {
        const childrenValidData = validatorData(item.children);
        valid = childrenValidData.valid;
        errMsg = childrenValidData.errMsg;
        formData.push(...childrenValidData.formData);
      }
    }
  }
  return { valid, errMsg, formData };
};

const init = (id) => {
  roleId.value = id;
  loadData();
};

const handleSubmit = async () => {
  // 校验及获取提交数据
  const { valid, errMsg, formData } = validatorData(tableData.value);
  if (!valid) {
    Message.error(errMsg || "权限未选择");
    return false;
  }
  try {
    loading.value = true;
    const { success, message } = await saveRoleMenuPerm(roleId.value, formData);
    if (!success) {
      Message.error(message || "保存失败");
      return false;
    }
    Message.success("保存成功");
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
.perm-container {
  width: 100%;
  overflow-y: auto;
}

.perm-list {
  display: flex;
  flex-direction: column;

  .perm-item {
    width: 100%;
    display: flex;
    height: 36px;
    align-items: center;

    .arco-checkbox {
      flex-shrink: 0;
      margin-right: 10px;
    }

    .data-scope {
      flex: 1;
      width: 100%;
      height: 36px;
      display: flex;
      align-items: center;

      .arco-radio {
        flex-shrink: 0;
      }

      :deep(.arco-radio-group) {
        height: 22px;
      }

      .data-scope-selector {
        flex: 1;
      }
    }
  }
}
</style>
