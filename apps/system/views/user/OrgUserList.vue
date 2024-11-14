<template>
  <div class="container">
    <a-row>
      <a-col :flex="1">
        <a-form :model="queryParam" :label-col-props="{ span: 10 }" :wrapper-col-props="{ span: 14 }" label-align="right">
          <a-row>
            <a-col :span="10">
              <a-form-item label="当前组织">
                <a-input :model-value="props.orgName" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder="请输入姓名" allow-clear />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="showMoreSearch">
            <a-col :span="10">
              <a-form-item label="启用状态">
                <a-select v-model="queryParam.isEnabled" placeholder="请选择" allow-clear>
                  <a-option v-for="item in isEnabledOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-col flex="200px" style="text-align: right">
        <a-space :size="10">
          <a-button type="primary" @click="search(true)">查询</a-button>
          <a-button @click="reset">重置</a-button>
          <a-link v-if="!showMoreSearch" @click="handleShowMoreSearch(true)">
            展开
            <icon-down />
          </a-link>
          <a-link v-else @click="handleShowMoreSearch(false)">
            收起
            <icon-up />
          </a-link>
        </a-space>
      </a-col>
    </a-row>
    <a-divider style="margin-top: 0" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="12">
        <a-space>
          <a-button v-if="props.orgType==2" type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            新建
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-table
        row-key="key"
        :loading="loading"
        :pagination="false"
        :data="tableData"
        page-position="tr"
        :bordered="false"
    >
      <template #columns>
        <a-table-column title="序号" data-index="index" width="80" align="center"></a-table-column>
        <a-table-column title="姓名" data-index="name" width="140"></a-table-column>
        <a-table-column title="所在部门" data-index="orgPath"></a-table-column>
        <a-table-column title="是否主部门" width="110" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.isMain==1" color="rgb(var(--success-6))">是</a-tag>
            <a-tag v-if="record.isMain!=1" color="rgb(var(--warning-6))">否</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="锁定状态" width="100" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.isLocked==0" color="rgb(var(--success-6))">解锁</a-tag>
            <a-tag v-if="record.isLocked!=0" color="rgb(var(--warning-6))">锁定</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="启用状态" width="100" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.isEnabled==1" color="rgb(var(--success-6))">启用</a-tag>
            <a-tag v-if="record.isEnabled!=1" color="rgb(var(--warning-6))">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="排序号" data-index="sn" width="80" align="right"></a-table-column>
        <a-table-column title="操作" align="center" width="180">
          <template #cell="{ record }">
            <a-space>
              <a-link v-if="record.isMain==1" :hoverable="false" @click="handleAddOrg(record)">增加部门</a-link>
              <a-link v-if="record.isMain!=1" :hoverable="false" disabled>增加部门</a-link>
              <a-link :hoverable="false" @click="handleEdit(record)">修改</a-link>
              <a-popconfirm content="确定要删除？" @ok="handleDelete(record)">
                <a-link :hoverable="false" status="danger">删除</a-link>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <div style="margin-top:5px;">
      <a-pagination
          :current="tablePagination.pageNo"
          :page-size="tablePagination.pageSize"
          :total="tablePagination.totalCount"
          show-total show-jumper
          @change="handleTablePageChange"
          @page-size-change="handleTablePageSizeChange"
      />
    </div>

    <a-modal v-model:visible="userAddVisible" title-align="start" draggable :width="800">
      <template #title>
        <icon-plus />
        新建用户
      </template>
      <user-add v-if="userAddVisible" ref="userAddRef" @success="search(false)"></user-add>
      <template #footer>
        <a-button @click="()=>{ userAddVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleUserAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <a-modal v-model:visible="userEditVisible" title-align="start" draggable :width="800">
      <template #title>
        <icon-edit />
        修改用户
      </template>
      <user-edit v-if="userEditVisible" ref="userEditRef" @success="loadTableData"></user-edit>
      <template #footer>
        <a-button @click="()=>{ userEditVisible = false }">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleUserEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <dept-selector ref="addUserOrgRef" @select="handleAddOrgSelect"></dept-selector>
  </div>
</template>

<script setup>
import { Message } from "@arco-design/web-vue";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { deleteOrgUser, queryOrgUser, saveOrgUser } from "../../api/orgUserApi";
import DeptSelector from "../../components/DeptSelector.vue";
import UserAdd from "./UserAdd.vue";
import UserEdit from "./UserEdit.vue";

const props = defineProps({
  orgId: String,
  orgType: String,
  orgName: String,
});
watch(
    () => props.orgId,
    (val) => {
      search(false);
    },
    { immediate: false },
);

const isEnabledOptions = ref([
  { text: "启用", value: 1 },
  { text: "禁用", value: 0 },
]);
const showMoreSearch = ref(false);
const handleShowMoreSearch = (show) => {
  showMoreSearch.value = show;
};
const loading = ref(false);
const queryParam = reactive({
  name: "",
  type: "",
  isEnabled: undefined,
});

const tableData = ref([]);
const tablePagination = reactive({
  pageNo: 1,
  pageSize: 10,
  totalCount: 0,
});
const handleTablePageChange = (pageNo) => {
  tablePagination.pageNo = pageNo;
  loadTableData();
};
const handleTablePageSizeChange = (pageSize) => {
  tablePagination.pageSize = pageSize;
  loadTableData();
};

onMounted(() => {
  search(false);
});

// 搜索
const search = (first = true) => {
  if (first) {
    tablePagination.pageNo = 1;
  }
  if (props.orgId) {
    loadTableData();
  }
};

const reset = () => {
  queryParam.isEnabled = undefined;
  queryParam.type = "";
  queryParam.name = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryOrgUser(props.orgId, tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

// add
const userAddRef = ref();
const userAddVisible = ref(false);
const handleAdd = () => {
  userAddVisible.value = true;
  nextTick(() => {
    userAddRef.value.init(props.orgId, props.orgName);
  });
};
const handleUserAddOk = async () => {
  const result = await userAddRef.value.handleSubmit();
  if (result) {
    userAddVisible.value = false;
  }
};

// update
const userEditRef = ref();
const userEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  userEditVisible.value = true;
  nextTick(() => {
    userEditRef.value.init(record.orgId, record.userId);
  });
};
const handleUserEditOk = async () => {
  const result = await userEditRef.value.handleSubmit();
  if (result) {
    userEditVisible.value = false;
  }
};

// delete
const handleDelete = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await deleteOrgUser(record.orgId, record.userId);
    if (success) {
      Message.success("删除成功");
      search(false);
    } else {
      Message.error(message || "删除失败");
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};

const addUserOrgRef = ref();
const currentAddUserId = ref("");
// 增加部门
const handleAddOrg = async (record) => {
  currentAddUserId.value = record.userId;
  addUserOrgRef.value.init({ title: "请选择部门" });
};
const handleAddOrgSelect = async (org) => {
  if (!org) {
    Message.warning("未选择部门");
    return;
  }
  try {
    loading.value = true;
    const { success, message } = await saveOrgUser(org.id, currentAddUserId.value);
    if (success) {
      Message.success("增加成功");
      search(false);
    } else {
      Message.error(message || "增加失败");
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

.arco-pagination {
  justify-content: flex-end;
}
</style>
