<template>
  <div class="container1">
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
        <a-table-column title="字典值" data-index="value" width="200"></a-table-column>
        <a-table-column title="字典文本" data-index="text"></a-table-column>
        <a-table-column title="启用状态" width="100" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.isEnabled==1" color="rgb(var(--success-6))">启用</a-tag>
            <a-tag v-if="record.isEnabled!=1" color="rgb(var(--warning-6))">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="排序号" data-index="sn" width="80" align="right"></a-table-column>
        <a-table-column title="操作" align="center" width="100">
          <template #cell="{ record }">
            <a-space>
              <icon-edit style="cursor:pointer;color:rgb(var(--primary-6));" @click="handleEdit(record)" />
              <a-popconfirm content="确定要删除？" @ok="handleDelete(record)" position="left">
                <icon-delete style="cursor:pointer;color:rgb(var(--warning-6));" />
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal v-model:visible="valueAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新建字典值
      </template>
      <a-spin :loading="loading">
        <value-add v-if="valueAddVisible" ref="valueAddRef" @success="loadTableData"></value-add>
      </a-spin>
      <template #footer>
        <a-button @click="()=>{ valueAddVisible = false }">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleValueAddOk">
          <a-button :loading="loading" type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>

    <a-modal v-model:visible="valueEditVisible" title-align="start" draggable>
      <template #title>
        <icon-edit />
        修改字典
      </template>
      <a-spin :loading="loading">
        <value-edit v-if="valueEditVisible" ref="valueEditRef" @success="loadTableData"></value-edit>
      </a-spin>
      <template #footer>
        <a-button @click="()=>{ valueEditVisible = false }">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleValueEditOk">
          <a-button :loading="loading" type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { deleteValue, listValue } from "../../api/dictApi";
import ValueAdd from "./ValueAdd.vue";
import ValueEdit from "./ValueEdit.vue";
import useLoading from "@/hooks/useLoading";

const emits = defineEmits(["refresh"]);
const props = defineProps({
  typeId: String,
});

const { loading, setLoading } = useLoading();
const tableData = ref([]);
onMounted(() => {
  loadTableData();
});
// 搜索
const search = () => {
  loadTableData();
};
const loadTableData = async () => {
  setLoading(true);
  try {
    const { data } = await listValue(props.typeId);
    tableData.value = data;
  } catch (err) {
    console.log("err", err);
  }
  setLoading(false);
};

// add
const valueAddRef = ref();
const valueAddVisible = ref(false);
const handleAdd = () => {
  valueAddVisible.value = true;
  nextTick(() => {
    valueAddRef.value.init(props.typeId);
  });
};
const handleValueAddOk = async () => {
  setLoading(true);
  const result = await valueAddRef.value.handleSubmit();
  if (result) {
    valueAddVisible.value = false;
    emits("refresh");
  }
  setLoading(false);
};

// update
const valueEditRef = ref();
const valueEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  valueEditVisible.value = true;
  nextTick(() => {
    valueEditRef.value.init(record.id);
  });
};
const handleValueEditOk = async () => {
  setLoading(true);
  const result = await valueEditRef.value.handleSubmit();
  if (result) {
    valueEditVisible.value = false;
  }
  setLoading(false);
};

// build delete
const handleDelete = async (record) => {
  setLoading(true);
  try {
    const { success, message } = await deleteValue(record.id);
    if (success) {
      Message.success("删除成功");
      search(false);
      emits("refresh");
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
  padding: 5px;
}

.arco-pagination {
  justify-content: flex-end;
}
</style>
