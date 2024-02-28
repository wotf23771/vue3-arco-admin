<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item label="配置范围">
                  <a-select :style="{width:'200px'}" v-model="queryParam.scopeType" placeholder="请选择" allow-clear>
                    <a-option value="DEFAULT">全局</a-option>
                    <a-option value="UNIT">单位</a-option>
                    <a-option value="USER">用户</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="参数名称">
                  <a-input v-model="queryParam.name" placeholder="请输入参数名称" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="参数编码">
                  <a-input v-model="queryParam.code" placeholder="请输入参数编码" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="配置类型">
                  <a-select :style="{width:'200px'}" v-model="queryParam.type" placeholder="请选择" allow-clear>
                    <a-option value="VALUE">固定配置</a-option>
                    <a-option value="LIST">列表配置</a-option>
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
          <a-table-column title="配置范围" width="120" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.scopeType=='DEFAULT'">全局</a-tag>
              <a-tag v-if="record.scopeType=='UNIT'">单位</a-tag>
              <a-tag v-if="record.scopeType=='USER'">用户</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="参数名称" data-index="name"></a-table-column>
          <a-table-column title="参数编码" data-index="code"></a-table-column>
          <a-table-column title="配置类型" width="120" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.type=='VALUE'">固定配置</a-tag>
              <a-tag v-if="record.type=='LIST'">列表配置</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="是否启用" width="120" align="center">
            <template #cell="{ record }">
              <a-switch v-model="record.isEnabled" :default-checked="true" type="round" :unchecked-value="0" :checked-value="1" disabled />
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
                <a-link :hoverable="false">配置</a-link>
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

    <a-modal v-model:visible="configAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新建参数
      </template>
      <config-add v-if="configAddVisible" ref="configAddRef" @success="search(false)"></config-add>
      <template #footer>
        <a-button @click="handleConfigAddCancel">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleConfigAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <a-modal v-model:visible="configEditVisible" title-align="start" draggable>
      <template #title>
        <icon-edit />
        修改参数
      </template>
      <config-edit v-if="configEditVisible" ref="configEditRef" @success="search(false)"></config-edit>
      <template #footer>
        <a-button @click="handleConfigEditCancel">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleConfigEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { deleteConfig, queryConfig } from "@/api/system/config";
import ConfigAdd from "./ConfigAdd.vue";
import ConfigEdit from "./ConfigEdit.vue";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const queryParam = reactive({
  scopeType: "",
  name: "",
  code: "",
  type: "",
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
  queryParam.scopeType = "";
  queryParam.type = "";
  queryParam.name = "";
  queryParam.code = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryConfig(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// config add
const configAddRef = ref();
const configAddVisible = ref(false);
const handleAdd = () => {
  configAddVisible.value = true;
};
const handleConfigAddOk = async () => {
  const result = await configAddRef.value.handleSubmit();
  if (result) {
    configAddVisible.value = false;
  }
};
const handleConfigAddCancel = () => {
  configAddVisible.value = false;
};

// config update
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
  const result = await configEditRef.value.handleSubmit();
  if (result) {
    configEditVisible.value = false;
  }
};
const handleConfigEditCancel = () => {
  configEditVisible.value = false;
};

// config delete
const handleDelete = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await deleteConfig(record.id);
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
