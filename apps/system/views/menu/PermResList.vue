<template>
  <a-modal
      v-model:visible="visible"
      width="auto"
      title-align="start"
      :mask-closable="false"
      :draggable="true"
  >
    <template #title>
      <span>{{ title }}</span>
    </template>
    <a-spin :loading="loading">
      <div v-if="visible" class="selector-container">
        <div class="selector-left">
          <a-row style="margin-bottom: 5px;">
            <a-col :span="12">
              <a-space>
                <a-input-search
                    v-model="searchValue"
                    :style="{width:'320px'}"
                    placeholder="请输入"
                    search-button
                    @input="handleSearch"
                    @search="handleSearch"
                    @press-enter="handleSearch"
                    allowClear
                />
              </a-space>
            </a-col>
          </a-row>
          <a-table
              ref='resTableRef'
              row-key="key"
              :pagination="false"
              :data="resData"
              :bordered="false"
              :scroll="{y:420}"
              :row-selection="rowSelection"
              @row-click="rowClick"
          >
            <template #columns>
              <!--              <a-table-column title="资源路径" data-index="path"></a-table-column>-->
              <a-table-column title="资源编码" data-index="authority"></a-table-column>
              <a-table-column title="资源名称" data-index="name" width="240"></a-table-column>
            </template>
          </a-table>
        </div>
        <div class="selector-right">
          <div class="selected-title">
            <div>已选择：<span class="selected-stat">{{ checkedKeys.length }}项</span></div>
            <div class="clear-all" @click="clearAll">清空已选</div>
          </div>
          <div class="selected-list">
            <a-scrollbar>
              <div class="selected-item" v-for="(item, index) in selected" :key="index">
                <div class="title">
                  {{ item.name }}
                </div>
                <div class="operator" @click.stop="clearItem(item.key)">
                  <icon-close :size="12" />
                </div>
              </div>
            </a-scrollbar>
          </div>
        </div>
      </div>
    </a-spin>

    <template #footer>
      <a-button @click="()=>{ visible = false }">关闭</a-button>
      <a-popconfirm content="确定要保存？" @ok="handleOk">
        <a-button type="primary">保存</a-button>
      </a-popconfirm>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { listRes, saveMenuPermRes } from "../../api/menuApi";
import { Message } from "@arco-design/web-vue";

const emits = defineEmits(["refresh"]);
const visible = ref(false);
const title = ref("");
const menuPermId = ref("");

const selected = computed(() => {
  if (resDataAll.value) {
    return resDataAll.value.filter((item) => {
      return item.selected == true;
    });
  }
  return [];
});
const checkedKeys = computed(() => {
  if (selected.value && selected.value.length > 0) {
    return selected.value.map(item => item.key);
  }
  return [];
});

const clearAll = () => {
  resDataAll.value.forEach((item) => {
    item.selected = false;
  });
};

const clearItem = (key) => {
  resDataAll.value.forEach((item) => {
    if (item.key == key) {
      item.selected = false;
    }
  });
};

const loading = ref(false);
const searchValue = ref("");
const resTableRef = ref();
const resData = ref([]);
const resDataAll = ref([]);
const rowSelection = reactive({
  type: "checkbox",
  showCheckedAll: false,
  onlyCurrent: false,
  selectedRowKeys: checkedKeys,
});
const rowClick = (record, e) => {
  record.selected = !record.selected;
  resTableRef.value.select(record.key, record.selected);
};
const loadResData = async () => {
  try {
    loading.value = true;
    const { data } = await listRes(menuPermId.value);
    resData.value = data;
    resDataAll.value = data;
  } catch (err) {
    loading.value = false;
  } finally {
    loading.value = false;
  }
};
const handleSearch = () => {
  resData.value = resDataAll.value;
  resData.value = resData.value.filter(item => {
    return item.path.includes(searchValue.value) || item.authority.includes(searchValue.value) || item.name.includes(searchValue.value);
  });
};

const handleOk = async () => {
  const authorityList = selected.value.map(item => item.authority);
  try {
    loading.value = true;
    const { success, message } = await saveMenuPermRes(menuPermId.value, authorityList);
    if (!success) {
      Message.error(message || "保存失败");
      return false;
    }
    Message.success("保存成功");
    emits("success");
    return true;
  } catch (err) {
    loading.value = false;
    return false;
  } finally {
    loading.value = false;
  }
};

const init = (data) => {
  title.value = data?.title;
  menuPermId.value = data?.menuPermId;
  visible.value = true;

  loadResData();
};

defineExpose({ init });
</script>

<style scoped lang="less">
.selector-container {
  display: flex;
  height: 500px;
  overflow: hidden;

  .selector-left {
    width: 600px;
    display: flex;
    flex-direction: column;
    padding-right: 10px;
  }

  .selector-right {
    width: 300px;
    padding: 15px 10px 0;
    display: flex;
    flex-direction: column;
    background-color: #fafafa;

    .selected-title {
      height: 20px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding: 0 10px;

      .clear-all {
        cursor: pointer;
        color: #999;
      }
    }

    .selected-stat {
      font-size: 12px;
      color: #999;
    }

    .selected-list {
      height: 100%;
      margin-top: 8px;
      overflow: auto;

      .selected-item {
        height: 32px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          display: flex;
          align-items: center;
          font-size: 14px;
        }

        .operator:hover {
          cursor: pointer;
          color: rgb(79, 127, 232);
        }
      }

      .selected-item:hover {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
