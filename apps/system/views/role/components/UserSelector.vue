<template>
  <a-modal v-model:visible="visible" width="auto" title-align="start" :mask-closable="false" :draggable="true"
           @cancel="handleCancel">
    <template #title>
      <span>{{ title }}</span>
    </template>
    <div v-if="visible" class="selector-container">
      <div class="selector-left">
        <div class="union-wrapper">
          <a-input-search style="margin-bottom: 8px;" v-model="unionSearchKey" placeholder="搜索工会"/>
          <a-tree ref="unionTreeRef" :data="treeData" block-node :expanded-keys="expendKeys" @expand="handleNodeExpand"
                  @select="handleNodeSelect" :field-names="{key: 'id', title: 'name'}"
          />
        </div>
        <a-divider direction="vertical" style="margin-top: 0"/>
        <div class="user-wrapper">
          <a-input-search style="margin-bottom: 8px;" v-model="userSearchKey" placeholder="搜索用户"/>
          <a-list :max-height="360" size="small" @reach-bottom="searchUser" :scrollbar="scrollbar" :bordered="false" :split="false"
                  :loading="loading">
            <template #scroll-loading>
              <div v-if="finish">没有更多了</div>
              <a-spin v-else/>
            </template>
            <a-list-item v-for="(item, index) in userList" :key="index">
              <div class="user-item" @click="handleClickUserItem(item)">
                <a-checkbox v-model="item.checked" @click.stop @change="handleUserSelect(item)">{{
                    item.name
                  }}
                </a-checkbox>
              </div>
            </a-list-item>
          </a-list>
        </div>
      </div>

      <div class="selector-right">
        <div class="selected-title">
          <div>已选择：<span class="selected-stat">{{ selectedIds.length }}项</span></div>
          <div class="clear-all" @click="clearAll">清空已选</div>
        </div>
        <div class="selected-list">
          <a-scrollbar>
            <div class="selected-item" v-for="(item, index) in selected" :key="index">
              <div class="title">
                {{ item.name }}
              </div>
              <div class="operator" @click.stop="clearItem(item, index)">
                <icon-close :size="12"/>
              </div>
            </div>
          </a-scrollbar>
        </div>
      </div>
    </div>
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, nextTick, reactive, ref, toRefs } from "vue";
import { loadUnionMemberList, loadUserUnionTreeData } from "../../../api/roleApi";
import { Message } from "@arco-design/web-vue";
import cloneDeep from "lodash-es/cloneDeep";

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});
const { multiple, required } = toRefs(props);

const emit = defineEmits(["select"]);

const title = ref("选择用户");
const visible = ref(false);
const selected = ref([]);
const selectedIds = ref([]);

const unionTreeRef = ref();
const unionSearchKey = ref("");
const unionList = ref([]);
const treeData = computed(() => {
  if (!unionList.value || unionList.value.length === 0) {
    return [];
  }
  if (!unionSearchKey.value) {
    return unionList.value;
  }
  return loop(unionSearchKey.value, unionList.value);
});
const expendKeys = ref([]);
const currentUnionId = ref("");

const loop = (keyword, data) => {
  const result = [];
  data.forEach(item => {
    if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
      result.push({ ...item });
    } else if (item.children) {
      const filterData = loop(keyword, item.children);
      if (filterData.length) {
        result.push({
          ...item,
          children: filterData,
        });
      }
    }
  });
  return result;
};

const handleNodeExpand = (keys, data) => {
  expendKeys.value = keys;
};

const handleNodeSelect = (keys, data) => {
  currentUnionId.value = data.node.id;
  Object.assign(page, {
    pageNo: 0,
    pageSize: 10,
    totalCount: 0,
  });
  scrollbar.value = true;
  finish.value = false;
  userList.value = [];
  searchUser();
};

const userSearchKey = ref("");
const userList = ref([]);
const page = reactive({
  pageNo: 0,
  pageSize: 10,
  totalCount: 0,
});
const scrollbar = ref(true);
const finish = ref(false);
const loading = ref(false);

const searchUser = () => {
  if (!currentUnionId.value) {
    return;
  }
  page.pageNo++;
  loading.value = true;
  loadUnionMemberList(currentUnionId.value, page).then((res) => {
    if (res.success) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((item) => {
          item.checked = selectedIds.value.includes(item.userId);
        });
        userList.value = [...userList.value, ...res.data];
        page.totalCount = res.page.totalCount;
        if (userList.value.length >= page.totalCount) {
          finish.value = true;
        }
      } else {
        finish.value = true;
      }
    }
    loading.value = false;
  });
};

const handleClickUserItem = (user) => {
  user.checked = !user.checked;
  handleUserSelect(user);
};

const handleUserSelect = (user) => {
  if (multiple.value) {
    if (user.checked) {
      selectedIds.value.push(user.userId);
      selected.value.push({ userId: user.userId, name: user.name });
    } else {
      selectedIds.value.splice(selectedIds.value.indexOf(user.userId), 1);
      selected.value = selected.value.filter((item) => item.userId !== user.userId);
    }
  } else {
    if (user.checked) {
      selectedIds.value = [user.userId];
      selected.value = [{ userId: user.userId, name: user.name }];
      userList.value.forEach((item) => {
        if (item.userId !== user.userId) {
          item.checked = false;
        }
      });
    } else {
      selectedIds.value = [];
      selected.value = [];
    }
  }
};

const clearAll = () => {
  selected.value = [];
  selectedIds.value = [];
  userList.value.forEach((item) => {
    item.checked = false;
  });
};

const clearItem = (user, index) => {
  selected.value.splice(index, 1);
  selectedIds.value.splice(index, 1);
  userList.value.forEach((item) => {
    if (item.userId === user.userId) {
      item.checked = false;
    }
  });
};

const init = (data) => {
  loadUserUnionTreeData("").then((res) => {
    if (res.success) {
      unionList.value = res.data;
      if (res.data && res.data.length > 0) {
        nextTick(() => {
          unionTreeRef.value.selectNode(res.data[0].id, true);
          currentUnionId.value = res.data[0].id;
          expendKeys.value = [res.data[0].id];
        });
      }
    }
  });
  title.value = data?.title;
  if (data?.selected && data.selected.length > 0) {
    selected.value = data?.selected;
    data.selected.forEach((item) => {
      selectedIds.value.push(item.userId);
    });
  }
  visible.value = true;
};

const handleOk = () => {
  if (required.value && selectedIds.value.length === 0) {
    Message.error("至少需选择一个用户");
    return;
  }
  emit("select", cloneDeep(selected.value));
  handleCancel();
};

const handleCancel = () => {
  Object.assign(page, {
    pageNo: 0,
    pageSize: 10,
    totalCount: 0,
  });
  currentUnionId.value = "";
  unionSearchKey.value = "";
  userSearchKey.value = "";
  scrollbar.value = true;
  finish.value = false;
  userList.value = [];
  selected.value = [];
  selectedIds.value = [];
  visible.value = false;
};

defineExpose({ init });
</script>

<style scoped lang="less">
.selector-container {
  display: flex;
  height: 400px;
  overflow: hidden;

  .selector-left {
    width: 540px;
    display: flex;
    padding-right: 10px;

    .union-wrapper {
      width: 220px;
      display: flex;
      flex-direction: column;
    }

    .user-wrapper {
      flex: 1;

      .user-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 5px 20px;
      }

      .user-item:hover {
        background: var(--color-neutral-2);
      }

      :deep(.arco-list-item) {
        padding: 0;
      }
    }
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
          color: rgb(var(--primary-5));
        }
      }

      .selected-item:hover {
        background: var(--color-neutral-2);
      }
    }
  }
}
</style>