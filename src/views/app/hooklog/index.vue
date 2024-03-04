<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item field="appId" label="所属应用">
                  <a-select  v-model="queryParam.appId" placeholder="请选择" allow-clear>
                    <a-option :key="app.appId" v-for="app of appDataList" :value="app.appId" :label="app.appName"></a-option>
                    
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="procInstName" label="事项名称">
                  <a-input v-model="queryParam.procInstName" placeholder="请输入事项名称" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="taskName" label="任务名称">
                  <a-input v-model="queryParam.taskName" placeholder="请输入任务名称" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="callbackType" label="回调类型">
                  <a-select  v-model="queryParam.callbackType" placeholder="请选择" allow-clear>
                    <a-option  value="1" label="流程回调"></a-option>
                    <a-option  value="2" label="任务回调"></a-option>
                  </a-select>
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
          <a-table-column title="事项名称" data-index="procInstName" align="center" ></a-table-column>
          <a-table-column title="任务名称" data-index="taskName" align="center" width="200"></a-table-column>
          <a-table-column title="回调时间" data-index="callbackDate" align="center" width="200"></a-table-column>
          <a-table-column title="回调类型"  align="center" width="200">
            <template #cell="{ record }">
              <a-tag v-if="record.callbackType=='1'">流程回调</a-tag>
              <a-tag v-if="record.callbackType=='2'">任务回调</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作" align="center" width="160">
            <template #cell="{ record }">
              <a-space>
                <a-link :hoverable="false" @click="handleDetail(record)">查看</a-link>
               
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
    <!-- 详情弹窗 -->
    <a-modal v-model:visible="logDeatilVisible" title-align="start" draggable>
      <template #title>
          回调日志详情
      </template>
      <hooklog-info v-if="logDeatilVisible"  ref="logDeatilRef"  ></hooklog-info>
      <template #footer>
        <a-button @click="handleLogDeatilCancel">关闭</a-button>
      </template>
    </a-modal>
   
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { appList } from "@/api/app/app";
import { queryAppCallbackLog } from "@/api/app/hooklog";
import { Message } from "@arco-design/web-vue";
import hooklogInfo from "./hooklogInfo.vue"

const loading = ref(false);
const queryParam = reactive({
  appId: "",
  procInstName: "",
  taskName: "",
  callbackType: "",
});
const appDataList = ref([]);
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
const loadAppList = () => {
  appList().then((res) => {
    
    appDataList.value = res.data;
  });
};

// 搜索
const search = (first = true) => {
  if (first) {
    tablePagination.pageNo = 1;
  }
  loadTableData();
};

const reset = () => {
  queryParam.appId = "";
  queryParam.procInstName = "";
  queryParam.taskName = "";
  queryParam.callbackType = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryAppCallbackLog(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// log detail
const logDeatilRef = ref();
const logDeatilVisible = ref(false);
const handleDetail = (record) => {
  logDeatilVisible.value = true;
  console.log(record);
  nextTick(() => {
    logDeatilRef.value.initdata(record);
  });
};

const handleLogDeatilCancel = () => {
  logDeatilVisible.value = false;
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
