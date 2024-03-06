<template>
  <div class="container">
    <a-card>
      
      
      <a-table
          row-key="id"
          :loading="loading"
          :pagination="false"
          :data="tableData"
          page-position="tr"
          :bordered="false"
      >
        <template #columns>
          <a-table-column title="流程定义id" data-index="actDefId" align="center" width="300"></a-table-column>
          <a-table-column title="版本" data-index="actVersion" align="center" width="80"></a-table-column>
          <a-table-column title="是否激活"  align="center" width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.isActive=='1'" color="green">是</a-tag>
              <a-tag v-if="record.isActive=='0'" color="red">否</a-tag>
           
             
            </template>
          </a-table-column>
         
          <a-table-column title="操作" align="center" width="160">
            <template #cell="{ record }">
              <a-space>
                <a-popconfirm content="确定要激活？" @ok="handleActive(record)">
                  <a-link :disabled="record.isActive=='1'" :hoverable="false"  >激活</a-link>
                </a-popconfirm>
                <a-link :hoverable="false" @click="handleDesign(record)" >设计</a-link>
               
                <a-popconfirm content="确定要删除？" @ok="handleDelete(record)">
                  <a-link :disabled="record.isActive=='1'" :hoverable="false" status="danger">删除</a-link>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
      <!-- <div style="margin-top:5px;">
        <a-pagination
            :current="tablePagination.pageNo"
            :page-size="tablePagination.pageSize"
            :total="tablePagination.totalCount"
            show-total show-jumper
            @change="handleTablePageChange"
            @page-size-change="handleTablePageSizeChange"
        />
      </div> -->
    </a-card>
    <!-- 设计流程 -->
    <a-modal v-model:visible="flowDesignVisible" title-align="start" fullscreen>
      <template #title>
        <icon-edit />
        设计流程
      </template>
      <flow-design v-if="flowDesignVisible" ref="flowDesignRef" @success="search(false)"></flow-design>
      <template #footer>
        <a-button @click="() =>{ flowDesignVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleSaveFlowDesign">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>

    </a-modal>
   
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { listProcDefVersion, activeProcDefVersion,deleteProcDefVersion } from  "@/api/def/config";
import FlowDesign from "./FlowDesign.vue";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);

const defKey = ref('');
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
  

});
const init = (key) => {
  defKey.value = key;
  loadTableData();
};

// 搜索
const search = (first = true) => {
  if (first) {
    tablePagination.pageNo = 1;
  }
  loadTableData();
};

const reset = () => {
  // queryParam.name = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data } = await listProcDefVersion(defKey.value );
    tableData.value = data;
   
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// 激活
const handleActive = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await activeProcDefVersion(record.procDefKey,record.actDefId);
    if (success) {
      Message.success("激活成功");
      search(false);
    } else {
      Message.error(message || "激活失败");
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};
// 删除
const handleDelete = async (record)=> {
  try {
    loading.value = true;
    const { success, message } = await deleteProcDefVersion(record.procDefKey,record.actDefId);
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

// 设计流程
const flowDesignRef = ref();
const flowDesignVisible = ref(false);
// 表格列表点击【设计】
const handleDesign = (record) => {
  flowDesignVisible.value = true;
  nextTick(() => {
    flowDesignRef.value.initByProcDefVersion(record);
  });
};
const handleSaveFlowDesign = async () => {
  const result = await flowDesignRef.value.handleSubmit();
  if (result) {
    flowDesignVisible.value = false;
  }
};


defineExpose({
  init
});

</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
.arco-pagination {
  justify-content: flex-end;
}
</style>
