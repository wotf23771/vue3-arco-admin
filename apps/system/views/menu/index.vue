<template>
  <div class="container">
    <Breadcrumb :items="['系统设置', '菜单管理']" />
    <a-card style="height:calc(100vh - 190px);overflow: auto;" :bordered="false">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleAdd('0','无')">新建一级菜单</a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-space>
            <a-button v-if="!isExpanded" type="primary" @click="handleExpandAll">全部展开</a-button>
            <a-button v-if="isExpanded" type="primary" @click="handleExpandAll">全部收起</a-button>
            <a-button type="primary" @click="search">刷新</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
          ref="tableRef"
          row-key="id"
          :loading="loading"
          :pagination="false"
          :data="tableData"
          :expandable
          :bordered="false"
          :scroll="{y: tableHeight}"
      >
        <template #columns>
          <a-table-column title="菜单名称" data-index="name" width="180"></a-table-column>
          <a-table-column title="菜单编码" data-index="code" width="140"></a-table-column>
          <a-table-column title="菜单图标" width="100" align="center">
            <template #cell="{ record }">
              <name-icon :icon="record.icon" />
            </template>
          </a-table-column>
          <a-table-column title="访问路径" data-index="path"></a-table-column>
          <a-table-column title="是否显示" width="100" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isVisible==1">是</a-tag>
              <a-tag v-if="record.isVisible!=1" color="rgb(var(--warning-6))">否</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="是否公共" width="100" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isPublic==1" color="rgb(var(--warning-6))">是</a-tag>
              <a-tag v-if="record.isPublic!=1">否</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="启用状态" width="100" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.isEnabled==1">启用</a-tag>
              <a-tag v-if="record.isEnabled!=1" color="rgb(var(--warning-6))">禁用</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="排序号" data-index="sn" width="80" align="right"></a-table-column>
          <a-table-column title="操作" align="center" width="240">
            <template #cell="{ record }">
              <a-space>
                <a-link :hoverable="false" @click="handleAdd(record.id,record.name)">新建下级</a-link>
                <a-link :hoverable="false" @click="handleEdit(record)">修改</a-link>
                <a-popconfirm content="确定要删除？" @ok="handleDelete(record)">
                  <a-link :hoverable="false" status="danger">删除</a-link>
                </a-popconfirm>
                <a-link :hoverable="false" @click="handleListPerm(record)">权限（{{ record.permCount }}）</a-link>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>

      <!--新建 start-->
      <a-modal v-model:visible="menuAddVisible" title-align="start" draggable :width="800">
        <template #title>
          <icon-plus />
          新建菜单
        </template>
        <menu-add v-if="menuAddVisible" ref="menuAddRef" @success="search"></menu-add>
        <template #footer>
          <a-button @click="()=>{ menuAddVisible = false }">取消</a-button>
          <a-popconfirm content="确定要保存？" @ok="handleMenuAddOk">
            <a-button type="primary">保存</a-button>
          </a-popconfirm>
        </template>
      </a-modal>
      <!--新建 end-->
      <!--修改 start-->
      <a-modal v-model:visible="menuEditVisible" title-align="start" draggable :width="800">
        <template #title>
          <icon-edit />
          修改菜单
        </template>
        <menu-edit v-if="menuEditVisible" ref="menuEditRef" @success="search"></menu-edit>
        <template #footer>
          <a-button @click="()=>{ menuEditVisible = false }">取消</a-button>
          <a-popconfirm content="确定要更新？" @ok="handleMenuEditOk">
            <a-button type="primary">更新</a-button>
          </a-popconfirm>
        </template>
      </a-modal>
      <!--修改 end-->

      <!-- 权限列表 -->
      <a-drawer :width="600" :visible="permListVisible" :footer="false" @cancel="()=>permListVisible = false">
        <template #title>
          {{ permListTitle }}
        </template>
        <perm-list v-if="permListVisible" ref="permListRef" :menu-id="menuId" @refresh="search"></perm-list>
      </a-drawer>
    </a-card>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { deleteMenu, listMenu } from "../../api/menuApi";
import NameIcon from "@/components/NameIcon/index.vue";
import MenuEdit from "./MenuEdit.vue";
import MenuAdd from "./MenuAdd.vue";
import PermList from "./PermList.vue";

const loading = ref(false);

const isExpanded = ref(false);
const tableRef = ref();

const tableData = ref([]);
const tableHeight = ref(500);
onMounted(() => {
  loadTableData();
  updateTableHeight();
  window.onresize = () => {
    updateTableHeight();
  };
});

const updateTableHeight = () => {
  tableHeight.value = document.body.clientHeight - 240;
};

// 搜索
const search = () => {
  loadTableData();
};

const handleExpandAll = () => {
  if (isExpanded.value) {
    // 设置为：收起
    tableRef.value.expandAll(false);
    isExpanded.value = false;
  } else {
    // 设置为：展开
    tableRef.value.expandAll(true);
    isExpanded.value = true;
  }
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data } = await listMenu();
    tableData.value = data;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// build add
const menuAddRef = ref();
const menuAddVisible = ref(false);
const handleAdd = (parentId, parentName) => {
  menuAddVisible.value = true;
  nextTick(() => {
    menuAddRef.value.init(parentId, parentName);
  });
};
const handleMenuAddOk = async () => {
  const result = await menuAddRef.value.handleSubmit();
  if (result) {
    menuAddVisible.value = false;
  }
};

// build update
const menuEditRef = ref();
const menuEditVisible = ref(false);
// 点击修改
const handleEdit = (record) => {
  menuEditVisible.value = true;
  nextTick(() => {
    menuEditRef.value.init(record.id);
  });
};
const handleMenuEditOk = async () => {
  const result = await menuEditRef.value.handleSubmit();
  if (result) {
    menuEditVisible.value = false;
  }
};

// build delete
const handleDelete = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await deleteMenu(record.id);
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

//******权限配置******
const permListTitle = ref("");
const permListRef = ref();
const permListVisible = ref(false);
const menuId = ref("");

const handleListPerm = (record) => {
  permListTitle.value = `权限列表-${record.name}`;
  menuId.value = record.id;
  permListVisible.value = true;
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
