<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item field="name" label="属性名称">
                  <a-input v-model="queryParam.name" placeholder="请输入属性名称" allow-clear />

                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="code" label="属性编码">
                  <a-input v-model="queryParam.code" placeholder="请输入属性编码" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="dataType" label="数据类型">
                  <a-select  v-model="queryParam.dataType" placeholder="请选择" allow-clear>
                    <a-option value="date" label="日期"></a-option>
                    <a-option value="number" label="数字"></a-option>
                    <a-option value="text" label="文本"></a-option>
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
              新增属性
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
          <a-table-column title="属性编码" data-index="code" align="center" width="200"></a-table-column>
          <a-table-column title="属性名称" data-index="name" align="center" width="200"></a-table-column>
          <a-table-column title="数据类型"  align="center" width="120">
            <template #cell="{ record }">
              <a-tag v-if="record.dataType=='date'">日期</a-tag>
              <a-tag v-if="record.dataType=='number'">数字</a-tag>
              <a-tag v-if="record.dataType=='text'">文本</a-tag>
             
            </template>
          </a-table-column>
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
    <a-modal v-model:visible="formPropertyAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新增表单
      </template>
      <form-property-add v-if="formPropertyAddVisible" ref="formPropertyAddRef" @success="search(false)"></form-property-add>
      <template #footer>
        <a-button @click="handleFormPropertyAddCancel">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleFormPropertyAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!-- 编辑弹窗 -->
    <a-modal v-model:visible="formPropertyEditVisible">
      <template #title>
          编辑表单
      </template>
      <form-property-edit v-if="formPropertyEditVisible"  ref="formPropertyEditRef"  @success="search(false)"></form-property-edit>
      <template #footer>
        <a-button @click="handleFormPropertyEditCancel">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleFormPropertyEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
   
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { queryFormProperty, deleteFormProperty } from "@/api/app/form";
import FormPropertyAdd from "./FormPropertyAdd.vue";
import FormPropertyEdit from "./FormPropertyEdit.vue";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const queryParam = reactive({
  formId:'',// 表单id
  name: "",
  code: "",
  dataType: "",
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
  queryParam.code = "";
  queryParam.dataType = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryFormProperty(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// form property add
const formPropertyAddRef = ref();
const formPropertyAddVisible = ref(false);
const handleAdd = () => {
  formPropertyAddVisible.value = true;
  nextTick(() => {
    formPropertyAddRef.value.init(queryParam.formId);
  });
};
const handleFormPropertyAddOk = async () => {
  
  const result = await formPropertyAddRef.value.handleSubmit();
  if (result) {
    formPropertyAddVisible.value = false;
  }

};

const handleFormPropertyAddCancel = () => {
  formPropertyAddVisible.value = false;
};
// form property delete
const handleDelete = async (record)=> {
  try {
    loading.value = true;
    const { success, message } = await deleteFormProperty(record.id);
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
const formPropertyEditRef = ref();
const formPropertyEditVisible = ref(false);
const editData = (record) => {
  formPropertyEditVisible.value = true;
  nextTick(() => {
    formPropertyEditRef.value.init(record);
  });
  
};
const handleFormPropertyEditOk = async () => {
  const res = await formPropertyEditRef.value.handleSubmit();
  if(res){
      formPropertyEditVisible.value = false;
    }
  
};

const handleFormPropertyEditCancel = () => {
  formPropertyEditVisible.value = false;
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
