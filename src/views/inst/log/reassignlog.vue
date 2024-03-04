<template>
    
        <a-card>
            <a-row>
            <a-col :flex="1">
                <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
                <a-row>
                    <a-col :span="6">
                    <a-form-item field="procInstName" label="事项">
                        <a-input v-model="queryParam.procInstName" placeholder="请输入事项" allow-clear />
                    </a-form-item>
                    </a-col>
                    <a-col :span="6">
                    <a-form-item field="taskName" label="任务名称">
                        <a-input v-model="queryParam.taskName" placeholder="请输入任务名称" allow-clear />
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
            <!-- <a-col :span="12">
                <a-space>
                <a-button type="primary" @click="handleAdd">
                    <template #icon>
                    <icon-plus />
                    </template>
                    新增
                </a-button>
                </a-space>
            </a-col> -->
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
                <a-table-column title="事项" data-index="procInstName" align="center" ></a-table-column>
                <a-table-column title="任务名称" data-index="taskName" align="center" width="200"></a-table-column>
                <a-table-column title="改派时间" data-index="reassignDate" align="center" width="200"></a-table-column>
                <a-table-column title="原审批人账号" data-index="originalUserAccount" align="center" width="200"></a-table-column>
                <a-table-column title="原审批人" data-index="originalUserName" align="center" width="200"></a-table-column>
                <a-table-column title="审批人账号" data-index="targetUserAccount" align="center" width="200"></a-table-column>
                <a-table-column title="审批人" data-index="targetUserName" align="center" width="200"></a-table-column>
    
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
   
  </template>
  
  <script setup>
  
  import { nextTick,onMounted, reactive, ref } from "vue";
  import { appList } from "@/api/app/app";
  import { queryReassignRecord } from "@/api/inst/log";
  
  import { Message } from "@arco-design/web-vue";
  
  const loading = ref(false);
  const queryParam = reactive({
    procInstName: "",
    taskName: "",
  });
  
  const appDataList = ref([]);
  const loadAppList = () => {
    appList().then((res) => {
      appDataList.value = res.data;
    });
  };
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
    loadAppList();
  });
  
  // 搜索
  const search = (first = true) => {
    if (first) {
      tablePagination.pageNo = 1;
    }
    loadTableData();
  };
  
  const reset = () => {
    queryParam.procInstName = "";
    queryParam.taskName = "";
    search();
  };
  const loadTableData = async () => {
    try {
      loading.value = true;
      const { data, page } = await queryReassignRecord(tablePagination, queryParam);
      tableData.value = data;
      tablePagination.totalCount = page.totalCount;
    } catch (err) {
      loading.value = false;
      console.log("err", err);
    } finally {
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
  