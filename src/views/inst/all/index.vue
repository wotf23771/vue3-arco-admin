<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                
                <a-form-item field="name" label="流程名称">
                  <a-input v-model="queryParam.name" placeholder="请输入流程定义名称" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="procInstStatus" label="流程状态">
                  <a-select  v-model="queryParam.procInstStatus" placeholder="请选择" allow-clear>
                    <a-option value="1" label="进行中"></a-option>
                    <a-option value="2" label="已结束"></a-option>
                    <a-option value="3" label="已作废"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="appId" label="所属应用">
                  <a-select  v-model="queryParam.appId" placeholder="请选择" allow-clear>
                    <a-option :key="item.appId" v-for="item of appDataList" :value="item.appId" :label="item.appName"></a-option>
                  
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="procDefKey" label="流程定义key">
                  <a-input v-model="queryParam.procDefKey" placeholder="请输入流程定义key" allow-clear />
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
          <a-table-column title="流程名称" data-index="name" align="center" width="200"></a-table-column>
          <a-table-column title="所属应用" data-index="appName" align="center" width="200"></a-table-column>
          <a-table-column title="流程定义名称" data-index="defName" align="center" width="200"></a-table-column> 
          <a-table-column title="表单编码" data-index="formCode" align="center" ></a-table-column>
          <a-table-column title="流程状态"  align="center" width="120">
            <template #cell="{ record }">
              <a-tag v-if="record.procInstStatus=='1'">进行中</a-tag>
              <a-tag v-if="record.procInstStatus=='2'">已结束</a-tag>
              <a-tag v-if="record.procInstStatus=='3'">已作废</a-tag>
             
            </template>
          </a-table-column>

          <a-table-column title="操作" align="center" width="300">
            <template #cell="{ record }">
              <a-space>
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
  </div>
</template>

<script setup>

import { nextTick,onMounted, reactive, ref } from "vue";
import { appList } from "@/api/app/app";
import { pageQueryProcInst } from "@/api/inst/all";

import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const queryParam = reactive({
  appId:"",
  name: "",
  defKey: "",
  defName: "",
  formCode: "",
  procInstStatus: "",
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
  queryParam.appId = "";
  queryParam.name = "";
  queryParam.defKey = "";
  queryParam.defName = "";
  queryParam.formCode = "";
  queryParam.procInstStatus = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await pageQueryProcInst(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};


//  delete
const handleDelete = async (record)=> {
  try {
    loading.value = true;
    const { success, message } = await deleteProcDef(record.procDefKey);
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




</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
.arco-pagination {
  justify-content: flex-end;
}
</style>
