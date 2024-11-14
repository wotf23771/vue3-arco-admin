<template>
  <div class="container">
    <a-row>
      <a-col :flex="1">
        <a-form :model="queryParam" :label-col-props="{ span: 10 }" :wrapper-col-props="{ span: 14 }" label-align="right">
          <a-row>
            <a-col :span="7">
              <a-form-item label="角色名称">
                <a-input v-model="queryParam.name" placeholder="请输入角色名称" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item label="角色编码">
                <a-input v-model="queryParam.code" placeholder="请输入角色编码" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item label="启用状态">
                <a-select v-model="queryParam.isEnabled" placeholder="请选择" allow-clear>
                  <a-option v-for="item in isEnabledOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="showMoreSearch">
            <a-col :span="7">
              <a-form-item label="是否系统角色">
                <a-select v-model="queryParam.isBuildIn" placeholder="请选择" allow-clear>
                  <a-option key="1" value="1">是</a-option>
                  <a-option key="0" value="0">否</a-option>
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
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            新建
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-table
        row-key="id"
        :loading="loading"
        :pagination="false"
        :data="tableData"
        page-position="tr"
        :bordered="false"
    >
      <template #columns>
        <a-table-column title="序号" data-index="index" :width="80" align="center"></a-table-column>
        <a-table-column title="角色名称" data-index="name" :width="200"></a-table-column>
        <a-table-column title="角色编码" data-index="code" :width="200"></a-table-column>
        <a-table-column title="所属工会" data-index="unionName"></a-table-column>
        <a-table-column title="数据范围" :width="140" align="center">
          <template #cell="{ record }">
            <a-popover v-if="record.dataScopeType === 4" position="right" :content-style="{padding: 0,border: 'none'}">
              <a-tag checkable>{{ getDataScopeTypeName(record.dataScopeType) }}</a-tag>
              <template #content>
                <a-list size="small">
                  <a-list-item v-for="(scope, index) in record.scopeList" :key="index">{{ scope.unionName }}</a-list-item>
                </a-list>
              </template>
            </a-popover>
            <a-tag v-else>{{ getDataScopeTypeName(record.dataScopeType) }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="是否系统角色" :width="120" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.isBuildIn==1" color="rgb(var(--success-6))">是</a-tag>
            <a-tag v-if="record.isBuildIn!=1" color="rgb(var(--warning-6))">否</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="启用状态" :width="120" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.isEnabled==1" color="rgb(var(--success-6))">启用</a-tag>
            <a-tag v-if="record.isEnabled!=1" color="rgb(var(--warning-6))">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="排序号" data-index="sn" :width="100" align="right"></a-table-column>
        <a-table-column title="操作" align="center" :width="180">
          <template #cell="{ record }">
            <a-space>
              <a-link :hoverable="false" @click="handleEditMember(record)">成员</a-link>
              <a-link :hoverable="false" @click="handleEditPerm(record)">权限</a-link>
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

    <!--新建配置 start-->
    <a-modal v-model:visible="roleAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新建角色
      </template>
      <role-add v-if="roleAddVisible" ref="roleAddRef" @success="search(false)"></role-add>
      <template #footer>
        <a-button @click="()=>{ roleAddVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleRoleAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!--新建配置 end-->
    <!--修改配置 start-->
    <a-modal v-model:visible="roleEditVisible" title-align="start" draggable>
      <template #title>
        <icon-edit />
        修改角色
      </template>
      <role-edit v-if="roleEditVisible" ref="roleEditRef" @success="search(false)"></role-edit>
      <template #footer>
        <a-button @click="()=>{ roleEditVisible = false }">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleRoleEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!--修改配置 end-->

    <role-user-list ref="roleUserListRef"></role-user-list>
    <a-modal v-model:visible="rolePermVisible" title-align="start" draggable fullscreen>
      <template #title>
        <icon-lock style="margin-right: 4px" />
        {{ rowPermTitle }}
      </template>
      <role-perm v-if="rolePermVisible" ref="rolePermRef" @success="search(false)" />
      <template #footer>
        <a-button @click="()=>{ rolePermVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleRolePermOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import RoleAdd from "./RoleAdd.vue";
import RoleEdit from "./RoleEdit.vue";
import { Message } from "@arco-design/web-vue";
import { deleteRole, queryRole } from "../../api/roleApi";
import RoleUserList from "./RoleUserList.vue";
import RolePerm from "./RolePerm.vue";
import { getDataScopeTypeName } from "./datas/roleData";

const isEnabledOptions = reactive([
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
  code: "",
  isEnabled: undefined,
  isBuildIn: undefined,
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
  loadTableData();
});

// 搜索
const search = (first = true) => {
  if (first) {
    tablePagination.pageNo = 1;
  }
  loadTableData();
};

const reset = () => {
  queryParam.isEnabled = undefined;
  queryParam.code = "";
  queryParam.name = "";
  queryParam.isBuildIn = undefined;
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryRole(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// build add
const roleAddRef = ref();
const roleAddVisible = ref(false);
const handleAdd = () => {
  roleAddVisible.value = true;
};
const handleRoleAddOk = async () => {
  const result = await roleAddRef.value.handleSubmit();
  if (result) {
    roleAddVisible.value = false;
  }
};

// build update
const roleEditRef = ref();
const roleEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  roleEditVisible.value = true;
  nextTick(() => {
    roleEditRef.value.init(record.id);
  });
};
const handleRoleEditOk = async () => {
  const result = await roleEditRef.value.handleSubmit();
  if (result) {
    roleEditVisible.value = false;
  }
};

// build delete
const handleDelete = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await deleteRole(record.id);
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

// 角色成员
const roleUserListRef = ref();
const handleEditMember = (record) => {
  roleUserListRef.value.init({ title: `角色成员-${record.name}`, roleId: record.id });
};

// 权限设置
const rolePermRef = ref();
const rowPermTitle = ref("");
const rolePermVisible = ref(false);
const handleEditPerm = (record) => {
  rolePermVisible.value = true;
  rowPermTitle.value = `权限设置-${record.name}`;
  nextTick(() => {
    rolePermRef.value.init(record.id);
  });
};
const handleRolePermOk = async () => {
  const result = await rolePermRef.value.handleSubmit();
  if (result) {
    rolePermVisible.value = false;
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
