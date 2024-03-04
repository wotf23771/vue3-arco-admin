<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item field="name" label="规则名称">
                  <a-input v-model="queryParam.name" placeholder="请输入规则名称" allow-clear />
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
              新增规则
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
          <a-table-column title="表单名称" data-index="formName" align="center" width="150"></a-table-column>
          <a-table-column title="规则名称" data-index="name" align="center" width="150" ></a-table-column>
          <a-table-column title="候选人规则bean" data-index="userRuleBean" align="center" width="150"></a-table-column>
          <a-table-column title="候选人规则名称" data-index="userRuleName" align="center" width="150"></a-table-column>
          <a-table-column title="候选人规则参数" data-index="userRuleParams" align="center" ></a-table-column>
          <a-table-column title="排序" data-index="sn" align="right" width="80"></a-table-column>
          <a-table-column title="操作" align="center" width="160">
            <template #cell="{ record }">
              <a-space>
                <a-link :hoverable="false" @click="editData(record)" >修改</a-link>
               
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
    <!-- 新增弹窗 -->
    <a-modal v-model:visible="formPageAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新增规则
      </template>
      <form-user-rule-add v-if="formPageAddVisible" ref="formPageAddRef" @success="search(false)"></form-user-rule-add>
      <template #footer>
        <a-button @click="handleFormPageAddCancel">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleFormPageAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!-- 编辑弹窗 -->
    <a-modal v-model:visible="formPageEditVisible">
      <template #title>
          编辑规则
      </template>
      <form-user-rule-edit v-if="formPageEditVisible"  ref="formPageEditRef"  @success="search(false)"></form-user-rule-edit>
      <template #footer>
        <a-button @click="handleFormPageEditCancel">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleFormPageEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
   
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { queryFormUserRule, deleteFormUserRule } from "@/api/app/form";
import FormUserRuleAdd from "./FormUserRuleAdd.vue";
import FormUserRuleEdit from "./FormUserRuleEdit.vue";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const queryParam = reactive({
  formId:'',// 表单id
  name: "",
  
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
  

});
const init = (formId) => {
  queryParam.formId = formId;
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
  queryParam.name = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryFormUserRule(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// form user rule add
const formPageAddRef = ref();
const formPageAddVisible = ref(false);
const handleAdd = () => {
  formPageAddVisible.value = true;
  nextTick(() => {
    formPageAddRef.value.init(queryParam.formId);
  });
};
const handleFormPageAddOk = async () => {
  
  const result = await formPageAddRef.value.handleSubmit();
  if (result) {
    formPageAddVisible.value = false;
  }

};

const handleFormPageAddCancel = () => {
  formPageAddVisible.value = false;
};
// form page delete
const handleDelete = async (record)=> {
  try {
    loading.value = true;
    const { success, message } = await deleteFormUserRule(record.id);
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

// form property edit
const formPageEditRef = ref();
const formPageEditVisible = ref(false);
const editData = (record) => {
  formPageEditVisible.value = true;
  nextTick(() => {
    formPageEditRef.value.init(record);
  });
  
};
const handleFormPageEditOk = async () => {
  const res = await formPageEditRef.value.handleSubmit();
  if(res){
      formPageEditVisible.value = false;
    }
  
};

const handleFormPageEditCancel = () => {
  formPageEditVisible.value = false;
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
