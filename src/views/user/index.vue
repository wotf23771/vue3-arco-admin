<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item label="账号">
                  <a-input v-model="queryParam.account" placeholder="请输入账号" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="姓名">
                  <a-input v-model="queryParam.name" placeholder="请输入姓名" allow-clear />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18">
            <a-button type="primary" @click="search(true)">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
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
          <a-table-column title="序号" data-index="index" width="80" align="center"></a-table-column>
          <a-table-column title="账号" data-index="account" width="180"></a-table-column>
          <a-table-column title="姓名" data-index="name"></a-table-column>
          <a-table-column title="性别" width="100" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.gender=='1'">男</a-tag>
              <a-tag v-else-if="record.gender=='2'">女</a-tag>
              <a-tag v-else>未知</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="职位" data-index="position" width="160"></a-table-column>
          <a-table-column title="是否锁定" width="100" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isLocked==0">否</a-tag>
              <a-tag v-else-if="record.isLocked==1">是</a-tag>
              <a-tag v-else>未知</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="最后一次登录时间" data-index="lastLoginTime" width="200" align="center"></a-table-column>
          <a-table-column title="创建时间" data-index="createDate" width="200" align="center"></a-table-column>
          <a-table-column title="排序号" data-index="sn" width="100" align="right"></a-table-column>
          <a-table-column title="操作" align="center" width="160">
            <template #cell="{ record }">
              <a-space>
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
    </a-card>

    <!--新建参数 start-->
    <a-modal v-model:visible="userAddVisible" title-align="start" width="800px" draggable>
      <template #title>
        <icon-plus />
        新建用户
      </template>
      <user-add v-if="userAddVisible" ref="userAddRef" @success="search(false)"></user-add>
      <template #footer>
        <a-button @click="()=>{ userAddVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!--新建参数 end-->
    <!--修改参数 start-->
    <a-modal v-model:visible="userEditVisible" title-align="start" width="800px" draggable>
      <template #title>
        <icon-edit />
        修改用户
      </template>
      <user-edit v-if="userEditVisible" ref="userEditRef" @success="search(false)"></user-edit>
      <template #footer>
        <a-button @click="()=>{ userEditVisible = false }">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!--修改参数 end-->
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import UserAdd from "./UserAdd.vue";
import UserEdit from "./UserEdit.vue";
import { Message } from "@arco-design/web-vue";
import { deleteUser, queryUser } from "@/api/userApi";

const loading = ref(false);
const queryParam = reactive({
  account: "",
  name: "",
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
  queryParam.account = "";
  queryParam.name = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryUser(tablePagination, queryParam);
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
const userAddRef = ref();
const userAddVisible = ref(false);
const handleAdd = () => {
  userAddVisible.value = true;
  nextTick(() => {
    userAddRef.value.init();
  });
};
const handleAddOk = async () => {
  const result = await userAddRef.value.handleSubmit();
  if (result) {
    userAddVisible.value = false;
  }
};

// build update
const userEditRef = ref();
const userEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  userEditVisible.value = true;
  nextTick(() => {
    userEditRef.value.init(record.id);
  });
};
const handleEditOk = async () => {
  const result = await userEditRef.value.handleSubmit();
  if (result) {
    userEditVisible.value = false;
  }
};

// build delete
const handleDelete = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await deleteUser(record.id);
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

</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

.arco-pagination {
  justify-content: flex-end;
}
</style>
