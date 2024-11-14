<template>
  <!-- 字典列表 -->
  <a-drawer :width="800" :visible="visible" :footer="false" @cancel="()=>visible = false">
    <template #title>
      <icon-user-group/>
      {{ title }}
    </template>
    <div>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 10 }" :wrapper-col-props="{ span: 14 }" label-align="right">
            <a-row>
              <a-col :span="12">
                <a-form-item label="成员名称">
                  <a-input v-model="queryParam.memberName" placeholder="请输入成员名称" allow-clear/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col flex="200px" style="text-align: right">
          <a-space :size="10">
            <a-button type="primary" @click="search(true)">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleAddMember">增加会员</a-button>
            <a-button type="primary" @click="handleAddUnion">增加工会</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
          row-key="id"
          :loading="loading"
          :pagination="false"
          :data="tableData"
          :bordered="false"
      >
        <template #columns>
          <a-table-column title="序号" data-index="index" :width="80" align="center"></a-table-column>
          <a-table-column title="成员名称" data-index="memberName"></a-table-column>
          <a-table-column title="成员类型" data-index="memberType" :width="100" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.memberType==1">单位</a-tag>
              <a-tag v-if="record.memberType==2">部门</a-tag>
              <a-tag v-if="record.memberType==3">岗位</a-tag>
              <a-tag v-if="record.memberType==4">用户</a-tag>
              <a-tag v-if="record.memberType==5">工会</a-tag>
              <a-tag v-if="record.memberType==6">会员</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createTime" :width="180" align="center"></a-table-column>
          <a-table-column title="操作" align="center" :width="80">
            <template #cell="{ record }">
              <a-space>
                <a-popconfirm content="确定要删除？" position="left" @ok="handleDelete(record)">
                  <icon-delete style="cursor:pointer;color:rgb(var(--warning-6));"/>
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
    </div>

    <multi-union-selector ref="unionSelectorRef" @select="handleSelectUnion"></multi-union-selector>
    <user-selector ref="userSelectorRef" multiple required @select="handleSelectUser"/>
  </a-drawer>
</template>
<script setup>

import { reactive, ref } from "vue";
import { deleteRoleMember, queryRoleMember, saveRoleUnion, saveRoleUser } from "../../api/roleMemberApi";
import MultiUnionSelector from "./components/MultiUnionSelector.vue";
import { Message } from "@arco-design/web-vue";
import UserSelector from "./components/UserSelector.vue";

const roleId = ref("");
const visible = ref(false);
const title = ref("");

const loading = ref(false);
const queryParam = reactive({
  memberName: "",
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

const search = (first = true) => {
  if (first) {
    tablePagination.pageNo = 1;
  }
  loadTableData();
};

const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page, success, message } = await queryRoleMember(roleId.value, tablePagination, queryParam);
    if (!success) {
      Message.error(message || "查询失败");
      return;
    }
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  queryParam.memberName = "";
  search();
};

const handleDelete = async (record) => {
  try {
    loading.value = true;
    const { success, message } = await deleteRoleMember(record.id);
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

const userSelectorRef = ref();
const handleAddMember = () => {
  userSelectorRef.value.init({ title: "选择会员" });
};
const handleSelectUser = async (userList) => {
  if (userList && userList.length > 0) {
    let ids = userList.map(user => user.userId);
    const { success, message } = await saveRoleUser(roleId.value, ids);
    if (!success) {
      Message.error(message || "增加失败");
      return false;
    }
    search(false);
    Message.success("增加成功");
  } else {
    Message.warning("未选择会员");
  }
};

const unionSelectorRef = ref();
const handleAddUnion = () => {
  unionSelectorRef.value.init({ title: "选择工会", multi: true });
};
const handleSelectUnion = async (nodes) => {
  if (nodes && nodes.length > 0) {
    let ids = nodes.map(node => node.id);
    const { success, message } = await saveRoleUnion(roleId.value, ids);
    if (!success) {
      Message.error(message || "增加失败");
      return false;
    }
    search(false);
    Message.success("增加成功");
  } else {
    Message.warning("未选择工会");
  }
};

const init = (data) => {
  title.value = data?.title;
  visible.value = true;
  roleId.value = data?.roleId;
  search(true);
};
defineExpose({ init });
</script>

<style scoped lang="less">
.arco-pagination {
  justify-content: flex-end;
}
</style>
