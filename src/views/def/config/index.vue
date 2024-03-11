<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item field="appId" label="所属应用">
                  <a-select v-model="queryParam.appId" placeholder="请选择" allow-clear>
                    <a-option :key="item.appId" v-for="item of appDataList" :value="item.appId" :label="item.appName"></a-option>

                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="name" label="流程定义名称">
                  <a-input v-model="queryParam.name" placeholder="请输入流程定义名称" allow-clear />
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
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增流程定义
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
          <a-table-column title="所属应用" data-index="appName" align="center" width="200"></a-table-column>
          <a-table-column title="流程定义名称" data-index="name" align="center" width="200"></a-table-column>
          <a-table-column title="流程定义key" data-index="procDefKey" align="center" width="200"></a-table-column>
          <a-table-column title="关联表单" data-index="formName" align="center"></a-table-column>
          <a-table-column title="激活版本" data-index="activeActDefVersion" align="center" width="100"></a-table-column>
          <a-table-column title="操作" align="center" width="400">
            <template #cell="{ record }">
              <a-space>
                <a-link :hoverable="false" @click="handleDesign(record)">设计</a-link>
                <a-link :hoverable="false" @click="editDefVersion(record)">版本</a-link>
                <!-- <a-link :hoverable="false" @click="handleGetProcDefImage(record)">查看</a-link> -->
                <a-popconfirm content="确定要发起流程？" @ok="handleTestStart(record)">
                  <a-link :hoverable="false">发起流程</a-link>
                </a-popconfirm>
                <a-popconfirm content="确定要删除？" @ok="handleDelete(record)">
                  <a-link :hoverable="false" status="danger">删除</a-link>
                </a-popconfirm>
                
                <!-- <a-link :hoverable="false" @click="editData(record)" >关联表单</a-link> -->
                <!-- <a-link :hoverable="false" @click="editDefOrg(record)">适用组织</a-link> -->
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
        新增流程定义
      </template>
      <def-add v-if="appAddVisible" ref="appAddRef" @success="search(false)"></def-add>
      <template #footer>
        <a-button @click="handleAppAddCancel">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleAppAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

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

    <!-- 适用组织 -->
    <a-drawer
        :width="500"
        :hide-cancel="true"
        :visible="defOrgVisible"
        @ok="handleDefOrgOk"
    >
      <template #header>
        <span>适用组织</span>
      </template>
      <def-org v-if="defOrgVisible" ref="defOrgRef"></def-org>
    </a-drawer>

    <!-- 流程版本 -->
    <a-drawer
        :width="1000"
        :hide-cancel="true"
        :visible="defVersionVisible"
        @ok="handleDefVersionOk"
    >
      <template #header>
        <span>流程版本</span>
      </template>
      <def-version v-if="defVersionVisible" ref="defVersionRef"></def-version>
    </a-drawer>


  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { appList } from "@/api/app/app";
import { deleteProcDef, queryProcDef,testStart,getProcDefImage,getXMLDefinition } from "@/api/def/config";
import DefAdd from "./DefAdd.vue";
import FlowDesign from "./FlowDesign.vue";
import DefOrg from "./DefOrg.vue";
import DefVersion from "./DefVersion.vue";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const queryParam = reactive({
  appId: "",
  name: "",
  procDefKey: "",
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
  queryParam.procDefKey = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryProcDef(tablePagination, queryParam);
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
// def delete
const handleDelete = async (record) => {
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

};

// 设计流程
const flowDesignRef = ref();
const flowDesignVisible = ref(false);
// 表格列表点击【设计】
const handleDesign = (record) => {
  flowDesignVisible.value = true;
  nextTick(() => {
    flowDesignRef.value.init(record);
  });
};
const handleSaveFlowDesign = async () => {
  const result = await flowDesignRef.value.handleSubmit();
  if (result) {
    flowDesignVisible.value = false;
  }
};


// 适用组织
const defOrgRef = ref();
const defOrgVisible = ref(false);
const editDefOrg = (record) => {
  defOrgVisible.value = true;
  nextTick(() => {
    defOrgRef.value.init(record);
  });

};
const handleDefOrgOk = () => {
  defOrgVisible.value = false;
};

// 流程版本
const defVersionRef = ref();
const defVersionVisible = ref(false);
const editDefVersion = (record) => {
  defVersionVisible.value = true;
  nextTick(() => {
    defVersionRef.value.init(record.procDefKey);
  });

};
const handleDefVersionOk = () => {
  defVersionVisible.value = false;
};



// 测试启动流程
const handleTestStart = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await testStart(record.procDefKey);
    if (success) {
      Message.success("操作成功");
      search(false);
    } else {
      Message.error(message || "操作失败");
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }

};

const handleGetProcDefImage = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await getProcDefImage(record.procDefKey);
    if (success) {
      Message.success("操作成功");
      search(false);
    } else {
      Message.error(message || "操作失败");
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }

};

const handleGetXMLDefinition = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await getXMLDefinition(record.procDefKey);
    if (success) {
      Message.success("操作成功");
      search(false);
    } else {
      Message.error(message || "操作失败");
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
