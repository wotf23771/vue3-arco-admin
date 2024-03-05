<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item field="appName" label="应用名称">
                  <a-input v-model="queryParam.appName" placeholder="请输入应用名称" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="appId" label="应用标识">
                  <a-input v-model="queryParam.appId" placeholder="请输入应用标识" allow-clear />
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
              新增应用
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
          <a-table-column title="序号" data-index="index" align="center" width="80"></a-table-column>
          <a-table-column title="应用名称" data-index="appName" align="center" width="200"></a-table-column>
          <a-table-column title="应用标识" data-index="appId" align="center" width="200"></a-table-column>
          <a-table-column title="PC端地址" data-index="pcHost" align="center"></a-table-column>
          <a-table-column title="移动端地址" data-index="mobileHost" align="center"></a-table-column>
          <a-table-column title="操作" align="center" width="160">
            <template #cell="{ record }">
              <a-space>
                <a-link :hoverable="false" @click="editData(record)" >修改</a-link>
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
    <!-- 新增弹窗 -->
    <a-modal v-model:visible="appAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新增应用
      </template>
      <app-add v-if="appAddVisible" ref="appAddRef"  @success="search(false)"></app-add>
      <template #footer>
        <a-button @click="handleAppAddCancel">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleAppAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!-- 编辑弹窗 -->
    <a-modal v-model:visible="appEditVisible" title-align="start" draggable>
      <template #title>
          编辑应用
      </template>
      <app-edit v-if="appEditVisible"  ref="appEditRef"  @success="search(false)" ></app-edit>
      <template #footer>
        <a-button @click="handleAppEditCancel">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleAppEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
   
  </div>
</template>

<script setup>

import { nextTick,onMounted, reactive, ref } from "vue";
import { queryApp,deleteApp } from "@/api/app/app";
import AppAdd from "./AppAdd.vue";
import AppEdit from "./AppEdit.vue";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const queryParam = reactive({
  appName: "",
  appId: "",
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
  queryParam.appName = "";
  queryParam.appId = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryApp(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// app add
const appAddRef = ref();
const appAddVisible = ref(false);
const handleAdd = () => {
  appAddVisible.value = true;
};
const handleAppAddOk = async () => {
  const result = await appAddRef.value.handleSubmit();
  if (result) {
    appAddVisible.value = false;
  }
 
};

const handleAppAddCancel = () => {
  appAddVisible.value = false;
};
// app delete
const handleDelete = async (record)=> {
  try {
    loading.value = true;
    const { success, message } = await deleteApp(record.id);
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

}

// app edit
const appEditRef = ref();
const appEditVisible = ref(false);
const editData = (record) => {
  appEditVisible.value = true;
  nextTick(() => {
    appEditRef.value.initdata(record);
  });
  
};
const handleAppEditOk = async () => {
 
    const result = await appEditRef.value.handleSubmit();
  if (result) {
    appEditVisible.value = false;
    // loadTableData();
  }
};

const handleAppEditCancel = () => {
  appEditVisible.value = false;
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
