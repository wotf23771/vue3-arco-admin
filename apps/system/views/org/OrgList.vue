<template>
  <div class="container1">
    <a-row>
      <a-col :flex="1">
        <a-form :model="queryParam" :label-col-props="{ span: 10 }" :wrapper-col-props="{ span: 14 }" label-align="right">
          <a-row>
            <a-col :span="10">
              <a-form-item label="名称">
                <a-input v-model="queryParam.name" placeholder="请输入名称" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="类型">
                <a-select v-model="queryParam.type" placeholder="请选择" allow-clear>
                  <a-option v-for="item in orgTypeOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="showMoreSearch">
            <a-col :span="10">
              <a-form-item label="启用状态">
                <a-select v-model="queryParam.isEnabled" placeholder="请选择" allow-clear>
                  <a-option v-for="item in isEnabledOptions" :key="item.value" :value="item.value">{{ item.text }}</a-option>
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
        <a-table-column title="序号" data-index="index" width="80" align="center"></a-table-column>
        <a-table-column title="名称" data-index="name"></a-table-column>
        <a-table-column title="类型" data-index="typeName" width="100" align="center"></a-table-column>
        <a-table-column title="启用状态" width="120" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.isEnabled==1" color="rgb(var(--success-6))">启用</a-tag>
            <a-tag v-if="record.isEnabled!=1" color="rgb(var(--warning-6))">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="排序号" data-index="sn" width="100" align="right"></a-table-column>
        <a-table-column title="操作" align="center" width="180">
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

    <a-modal v-model:visible="orgAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新建组织
      </template>
      <a-spin :loading="loading">
        <org-add v-if="orgAddVisible" ref="orgAddRef" @success="search(false)"></org-add>
      </a-spin>
      <template #footer>
        <a-button @click="()=>{ orgAddVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleOrgAddOk">
          <a-button :loading="loading" type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <a-modal v-model:visible="orgEditVisible" title-align="start" draggable>
      <template #title>
        <icon-edit />
        修改组织
      </template>
      <a-spin :loading="loading">
        <org-edit v-if="orgEditVisible" ref="orgEditRef" @success="loadTableData"></org-edit>
      </a-spin>
      <template #footer>
        <a-button @click="()=>{ orgEditVisible = false }">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleOrgEditOk">
          <a-button :loading type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { deleteOrg, queryOrgChildren } from "../../api/orgApi";
import { listDictItem } from "@/api/dictApi";
import OrgAdd from "./OrgAdd.vue";
import OrgEdit from "./OrgEdit.vue";
import { Message } from "@arco-design/web-vue";
import useLoading from "@/hooks/useLoading";

const { loading, setLoading } = useLoading();
const emits = defineEmits(["refresh", "update"]);
const props = defineProps({
  parentId: String,
});
watch(
    () => props.parentId,
    (val) => {
      search(false);
    },
    { immediate: false },
);

const orgTypeOptions = ref([]);

const isEnabledOptions = ref([
  { text: "启用", value: 1 },
  { text: "禁用", value: 0 },
]);
const showMoreSearch = ref(false);
const handleShowMoreSearch = (show) => {
  showMoreSearch.value = show;
};
const queryParam = reactive({
  name: "",
  type: "",
  isEnabled: undefined,
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
  search(false);
  listDictItem("ORG_TYPE").then(res => {
    orgTypeOptions.value = res.data;
  });
});

// 搜索
const search = (first = true) => {
  if (first) {
    tablePagination.pageNo = 1;
  }
  if (props.parentId) {
    loadTableData();
  }
};

const reset = () => {
  queryParam.isEnabled = undefined;
  queryParam.type = "";
  queryParam.name = "";
  search();
};
const loadTableData = async () => {
  setLoading(true);
  try {
    const { data, page } = await queryOrgChildren(props.parentId, tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    console.log("err", err);
  }
  setLoading(false);
};

// add
const orgAddRef = ref();
const orgAddVisible = ref(false);
const handleAdd = () => {
  orgAddVisible.value = true;
  nextTick(() => {
    orgAddRef.value.init(props.parentId);
  });
};
const handleOrgAddOk = async () => {
  setLoading(true);
  const result = await orgAddRef.value.handleSubmit();
  if (result) {
    orgAddVisible.value = false;
    emits("update");
  }
  setLoading(false);
};

// update
const orgEditRef = ref();
const orgEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  orgEditVisible.value = true;
  nextTick(() => {
    orgEditRef.value.init(record.id);
  });
};
const handleOrgEditOk = async () => {
  setLoading(true);
  const result = await orgEditRef.value.handleSubmit();
  if (result) {
    orgEditVisible.value = false;
    emits("update");
  }
  setLoading(false);
};

// delete
const handleDelete = async (record) => {
  setLoading(true);
  try {
    const { success, message } = await deleteOrg(record.id);
    if (success) {
      Message.success("删除成功");
      search(false);
      emits("update");
    } else {
      Message.error(message || "删除失败");
    }
  } catch (err) {
  }
  setLoading(false);
};
</script>

<style scoped lang="less">
.container1 {
  padding-left: 16px;
}

.arco-pagination {
  justify-content: flex-end;
}
</style>
