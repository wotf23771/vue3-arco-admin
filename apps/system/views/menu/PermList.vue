<template>
  <div class="container1">
    <a-row style="margin-bottom: 16px">
      <a-col :span="12">
        <a-space>
          <a-button type="primary" @click="handleAdd">新建</a-button>
        </a-space>
      </a-col>
      <a-col :span="12" style="text-align: right">
        <a-space>
          <a-button type="primary" @click="search">刷新</a-button>
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
        <a-table-column title="权限名称" data-index="name"></a-table-column>
        <a-table-column title="权限编码" data-index="code" width="200"></a-table-column>
        <a-table-column title="排序号" data-index="sn" width="80" align="right"></a-table-column>
        <a-table-column title="操作" align="center" width="100">
          <template #cell="{ record }">
            <a-space>
              <a-tooltip content="修改权限" mini>
                <icon-edit style="cursor:pointer;color:rgb(var(--primary-6));" @click="handleEdit(record)" />
              </a-tooltip>
              <a-popconfirm content="确定要删除？" @ok="handleDelete(record)" position="left">
                <a-tooltip content="删除权限" mini>
                  <icon-delete style="cursor:pointer;color:rgb(var(--warning-6));" />
                </a-tooltip>
              </a-popconfirm>
              <a-tooltip content="资源清单" mini>
                <icon-select-all style="cursor:pointer;color:rgb(var(--primary-6));" @click="handleEditRes(record)" />
              </a-tooltip>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal v-model:visible="permAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新建权限
      </template>
      <perm-add v-if="permAddVisible" ref="permAddRef" @success="loadTableData"></perm-add>
      <template #footer>
        <a-button @click="()=>{ permAddVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handlePermAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <a-modal v-model:visible="permEditVisible" title-align="start" draggable>
      <template #title>
        <icon-edit />
        修改权限
      </template>
      <perm-edit v-if="permEditVisible" ref="permEditRef" @success="loadTableData"></perm-edit>

      <template #footer>
        <a-button @click="()=>{ permEditVisible = false }">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handlePermEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <perm-res-list ref="permResListRef"></perm-res-list>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import PermAdd from "./PermAdd.vue";
import PermEdit from "./PermEdit.vue";
import { deleteMenuPerm, listMenuPerm } from "../../api/menuApi";
import PermResList from "./PermResList.vue";

const emits = defineEmits(["refresh"]);
const props = defineProps({
  menuId: String,
});

const loading = ref(false);
const queryParam = reactive({
  name: "",
  code: "",
  isEnabled: undefined,
  value: "",
});

const tableData = ref([]);

onMounted(() => {
  loadTableData();
});

// 搜索
const search = () => {
  loadTableData();
};

const loadTableData = async () => {
  try {
    loading.value = true;
    const { data } = await listMenuPerm(props.menuId);
    tableData.value = data;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// add
const permAddRef = ref();
const permAddVisible = ref(false);
const handleAdd = () => {
  permAddVisible.value = true;
  nextTick(() => {
    permAddRef.value.init(props.menuId);
  });
};
const handlePermAddOk = async () => {
  const result = await permAddRef.value.handleSubmit();
  if (result) {
    permAddVisible.value = false;
    emits("refresh");
  }
};

// update
const permEditRef = ref();
const permEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  permEditVisible.value = true;
  nextTick(() => {
    permEditRef.value.init(record.id);
  });
};
const handlePermEditOk = async () => {
  const result = await permEditRef.value.handleSubmit();
  if (result) {
    permEditVisible.value = false;
  }
};

// build delete
const handleDelete = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await deleteMenuPerm(record.id);
    if (success) {
      Message.success("删除成功");
      search(false);
      emits("refresh");
    } else {
      Message.error(message || "删除失败");
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};

const permResListRef = ref();
const handleEditRes = (record) => {
  permResListRef.value.init({ menuPermId: record.id, title: `资源清单-${record.name}` });
};
</script>

<style scoped lang="less">
.container1 {
  padding: 5px;
}

.arco-pagination {
  justify-content: flex-end;
}
</style>
