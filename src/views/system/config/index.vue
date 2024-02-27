<template>
  <div class="container">
    <a-card>
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="queryParam"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row>
              <a-col :span="6">
                <a-form-item field="name" label="参数名称">
                  <a-input v-model="queryParam.name" placeholder="请输入参数名称" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button>
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>

    </a-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { queryConfig } from "@/api/system/config";

const queryParam = reactive({
  name: ""
});
const pageParam = reactive({
  pageNo: 1,
  pageSize: 10,
  totalCount: 0
});
const dataList = ref([]);

onMounted(() => {
  loadTableData();
});

const loadTableData = () => {
  queryConfig(pageParam, queryParam).then(response => {
    console.log(response);
    dataList.value = response.data;
    pageParam.totalCount = response.page.totalCount;
  });
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
</style>
