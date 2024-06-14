<template>
  <div class="container">
    <Breadcrumb :items="['参数设置', '系统参数']" />
    <a-card style="height:calc(100vh - 170px);overflow: auto;" :bordered="false">
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 10 }" :wrapper-col-props="{ span: 14 }" label-align="right">
            <a-row>
              <a-col :span="7">
                <a-form-item label="配置名称">
                  <a-input v-model="queryParam.name" placeholder="请输入配置名称" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item label="配置编码">
                  <a-input v-model="queryParam.code" placeholder="请输入配置编码" allow-clear />
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
                <a-form-item label="配置内容">
                  <a-input v-model="queryParam.value" placeholder="请输入配置内容" allow-clear />
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
        <a-col :span="12" style="text-align: right">
          <a-button type="primary" @click="handleRefreshCache">刷新缓存</a-button>
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
          <a-table-column title="配置名称" data-index="name" width="200"></a-table-column>
          <a-table-column title="配置编码" data-index="code" width="200"></a-table-column>
          <a-table-column title="配置内容" data-index="value"></a-table-column>
          <a-table-column title="启用状态" width="120" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isEnabled==1" color="rgb(var(--success-6))">启用</a-tag>
              <a-tag v-if="record.isEnabled!=1" color="rgb(var(--warning-6))">禁用</a-tag>
            </template>
          </a-table-column>
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

      <!--新建配置 start-->
      <a-modal v-model:visible="configAddVisible" title-align="start" draggable>
        <template #title>
          <icon-plus />
          新建配置
        </template>
        <a-spin :loading="loading">
          <config-add v-if="configAddVisible" ref="configAddRef" @success="search(false)"></config-add>
        </a-spin>
        <template #footer>
          <a-button @click="()=>{ configAddVisible = false }">取消</a-button>
          <a-popconfirm content="确定要保存？" @ok="handleConfigAddOk">
            <a-button :loading="loading" type="primary">保存</a-button>
          </a-popconfirm>
        </template>
      </a-modal>
      <!--新建配置 end-->
      <!--修改配置 start-->
      <a-modal v-model:visible="configEditVisible" title-align="start" draggable>
        <template #title>
          <icon-edit />
          修改配置
        </template>
        <a-spin :loading="loading">
          <config-edit v-if="configEditVisible" ref="configEditRef" @success="search(false)"></config-edit>
        </a-spin>
        <template #footer>
          <a-button @click="()=>{ configEditVisible = false }">取消</a-button>
          <a-popconfirm content="确定要更新？" @ok="handleConfigEditOk">
            <a-button :loading="loading" type="primary">更新</a-button>
          </a-popconfirm>
        </template>
      </a-modal>
      <!--修改配置 end-->
    </a-card>
  </div>
</template>
<script>
export default {
  name: "Config",
};
</script>
<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import ConfigAdd from "./ConfigAdd.vue";
import ConfigEdit from "./ConfigEdit.vue";
import { Message } from "@arco-design/web-vue";
import { deleteConfig, queryConfig, refreshConfigCache } from "../../api/configApi";
import useLoading from "@/hooks/useLoading";
import { load } from "@amap/amap-jsapi-loader";

const isEnabledOptions = reactive([
  { text: "启用", value: 1 },
  { text: "禁用", value: 0 },
]);
const showMoreSearch = ref(false);
const handleShowMoreSearch = (show) => {
  showMoreSearch.value = show;
};
const { loading, setLoading } = useLoading();
const queryParam = reactive({
  name: "",
  code: "",
  isEnabled: undefined,
  value: "",
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
  queryParam.type = "";
  queryParam.name = "";
  queryParam.value = "";
  search();
};
const loadTableData = async () => {
  try {
    setLoading(true);
    const { data, page } = await queryConfig(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    setLoading(false);
    console.log("err", err);
  } finally {
    setLoading(false);
  }
};

// build add
const configAddRef = ref();
const configAddVisible = ref(false);
const handleAdd = () => {
  configAddVisible.value = true;
};
const handleConfigAddOk = async () => {
  setLoading(true);
  const result = await configAddRef.value.handleSubmit();
  if (result) {
    configAddVisible.value = false;
  }
  setLoading(false);
};

// build update
const configEditRef = ref();
const configEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  configEditVisible.value = true;
  nextTick(() => {
    configEditRef.value.init(record.id);
  });
};
const handleConfigEditOk = async () => {
  setLoading(true);
  const result = await configEditRef.value.handleSubmit();
  if (result) {
    configEditVisible.value = false;
  }
  setLoading(true);
};

// build delete
const handleDelete = async (record) => {
  setLoading(true);
  try {
    const { success, message } = await deleteConfig(record.id);
    if (success) {
      Message.success("删除成功");
      search(false);
    } else {
      Message.error(message || "删除失败");
    }
  } catch (err) {
  }
  setLoading(false);
};

const handleRefreshCache = async () => {
  setLoading(true);
  try {
    const { success, message } = await refreshConfigCache();
    if (success) {
      Message.success("刷新成功");
    } else {
      Message.error(message || "刷新失败");
    }
  } catch (err) {
  }
  setLoading(false);
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px;
}

.arco-pagination {
  justify-content: flex-end;
}
</style>
