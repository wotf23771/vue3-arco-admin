<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form :model="queryParam" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }" label-align="right">
            <a-row>
              <a-col :span="6">
                <a-form-item field="name" label="表单名称">
                  <a-input v-model="queryParam.name" placeholder="请输入表单名称" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="code" label="表单编码">
                  <a-input v-model="queryParam.code" placeholder="请输入表单编码" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="appId" label="所属应用">
                  <a-select  v-model="queryParam.appId" placeholder="请选择" allow-clear>
                    <a-option :key="app.appId" v-for="app of appDataList" :value="app.appId" :label="app.appName"></a-option>
                    
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
              新增表单
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
          <a-table-column title="应用名称" data-index="appName" align="center" width="200"></a-table-column>
          <a-table-column title="表单编码" data-index="code" align="center" width="200"></a-table-column>
          <a-table-column title="表单名称" data-index="name" align="center" ></a-table-column>
          <a-table-column title="排序" data-index="sn" align="right" width="80"></a-table-column>
          <a-table-column title="操作" align="center" width="350">
            <template #cell="{ record }">
              <a-space>
                <a-link :hoverable="false" @click="editData(record)" >修改</a-link>
               
                <a-popconfirm content="确定要删除？" @ok="handleDelete(record)">
                  <a-link :hoverable="false" status="danger">删除</a-link>
                </a-popconfirm>
                <a-link :hoverable="false" @click="editProperty(record)" >配置属性</a-link>
                <a-link :hoverable="false" @click="editPage(record)" >配置页面</a-link>
                <a-link :hoverable="false" @click="editUserRule(record)" >配置参与规则</a-link>
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
    <a-modal v-model:visible="formAddVisible" title-align="start" draggable>
      <template #title>
        <icon-plus />
        新增表单
      </template>
      <form-add v-if="formAddVisible" ref="formAddRef" @success="search(false)"></form-add>
      <template #footer>
        <a-button @click="handleFormAddCancel">取消</a-button>
        <a-popconfirm content="确定要保存？" @ok="handleFormAddOk">
          <a-button type="primary">保存</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!-- 编辑弹窗 -->
    <a-modal v-model:visible="formEditVisible">
      <template #title>
          编辑表单
      </template>
      <form-edit v-if="formEditVisible"  ref="formEditRef"  @success="search(false)"></form-edit>
      <template #footer>
        <a-button @click="handleFormEditCancel">取消</a-button>
        <a-popconfirm content="确定要更新？" @ok="handleFormEditOk">
          <a-button type="primary">更新</a-button>
        </a-popconfirm>
      </template>
    </a-modal>
    <!-- 配置属性抽屉 -->
    <a-drawer
    :width="1500"
    :hide-cancel="true"
    :visible="formPropertyVisible"   
    @ok="handleFormPropertyOk"
  >
    <template #header>
      <span>表单属性</span>
    </template>
   <form-property v-if="formPropertyVisible" ref="formPropertyRef" ></form-property>
  </a-drawer>
  <!-- 表单页面抽屉 -->
  <a-drawer
    :width="1500"
    :hide-cancel="true"
    :visible="formPageVisible"   
    @ok="handleFormPageOk"
  >
    <template #header>
      <span>表单页面</span>
    </template>
   <form-page v-if="formPageVisible" ref="formPageRef" ></form-page>
  </a-drawer>
  <!-- 表单参与者规则抽屉 -->
    <a-drawer
    :width="1500"
    :hide-cancel="true"
    :visible="formUserRuleVisible"   
    @ok="handleFormUserRuleOk"
  >
    <template #header>
      <span>表单页面</span>
    </template>
   <form-user-rule v-if="formUserRuleVisible" ref="formUserRuleRef" ></form-user-rule>
  </a-drawer>
  </div>
</template>

<script setup>

import { nextTick, onMounted, reactive, ref } from "vue";
import { appList } from "@/api/app/app";
import { queryForm,deleteForm } from "@/api/app/form";
import FormAdd from "./FormAdd.vue";
import FormEdit from "./FormEdit.vue";
import FormProperty from "./FormProperty.vue";
import FormPage  from "./FormPage.vue";
import FormUserRule  from "./FormUserRule.vue";
import { Message } from "@arco-design/web-vue";

const loading = ref(false);
const queryParam = reactive({
  name: "",
  code: "",
  appId: "",
});
const appDataList = ref([]);
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
const loadAppList = () => {
  appList().then((res) => {
    
    appDataList.value = res.data;
  });
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
  queryParam.appId = "";
  search();
};
const loadTableData = async () => {
  try {
    loading.value = true;
    const { data, page } = await queryForm(tablePagination, queryParam);
    tableData.value = data;
    tablePagination.totalCount = page.totalCount;
  } catch (err) {
    loading.value = false;
    console.log("err", err);
  } finally {
    loading.value = false;
  }
};

// form add
const formAddRef = ref();
const formAddVisible = ref(false);
const handleAdd = () => {
  formAddVisible.value = true;
};
const handleFormAddOk = async () => {
  
  const result = await formAddRef.value.handleSubmit();
  if (result) {
    formAddVisible.value = false;
  }

};

const handleformAddCancel = () => {
  formAddVisible.value = false;
};
// form delete
const handleDelete = async (record)=> {
  try {
    loading.value = true;
    const { success, message } = await deleteForm(record.id);
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

// form edit
const formEditRef = ref();
const formEditVisible = ref(false);
const editData = (record) => {
  formEditVisible.value = true;
  nextTick(() => {
    formEditRef.value.initdata(record);
  });
  
};
const handleFormEditOk = async () => {
  const res = await formEditRef.value.handleSubmit();
  if(res){
      formEditVisible.value = false;
    }
  
};

const handleFormEditCancel = () => {
  formEditVisible.value = false;
};

// 表单属性
const formPropertyRef = ref();
const formPropertyVisible = ref(false);
const editProperty = (record) => {
  formPropertyVisible.value = true;
  nextTick(() => {
    formPropertyRef.value.init(record.id);
  });
};
const handleFormPropertyOk =  () => {
  formPropertyVisible.value = false;
};

// 表单页面
const formPageRef = ref();
const formPageVisible = ref(false);
const editPage = (record) => {
  formPageVisible.value = true;
  nextTick(() => {
    formPageRef.value.init(record.id);
  });
};
const handleFormPageOk =  () => {
  formPageVisible.value = false;
};

// 表单参与者规则
const formUserRuleRef = ref();
const formUserRuleVisible = ref(false);
const editUserRule = (record) => {
  formUserRuleVisible.value = true;
  nextTick(() => {
    formUserRuleRef.value.init(record.id);
  });
};
const handleFormUserRuleOk =  () => {
  formUserRuleVisible.value = false;
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
