<template>
  <a-modal
      v-model:visible="visible"
      title-align="start"
      draggable
      :width="400"
      @cancel="handleCancel"
      @ok="handleOk"
  >
    <template #title>
      {{ title }}
    </template>
    <a-tree
        v-if="visible"
        ref="treeRef"
        :field-names="treeFieldNames"
        :data="treeData"
        :load-more="loadTreeMore"
        @select="handleClickTreeNode"
        block-node>
      <template #switcher-icon>
        <IconDown />
      </template>
      <template #icon="{ node }">
        <IconHome v-if="node.type==1" />
        <IconStorage v-if="node.type==2" />
      </template>
    </a-tree>
  </a-modal>
</template>

<script setup>

import { nextTick, onMounted, ref, unref } from "vue";
import { IconHome } from "@arco-design/web-vue/es/icon";
import { listOrgByParentId } from "../api/orgApi";

const emits = defineEmits(["select"]);
const visible = ref(false);
const title = ref("");

const treeRef = ref();
const treeFieldNames = {
  key: "id",
  title: "name",
  children: "children",
};
// 默认打开的节点KEY
const defaultExpendKey = ref("");
const treeData = ref([]);

onMounted(() => {
  loadTreeRoot();
  nextTick(() => {
    setTimeout(() => {
      if (defaultExpendKey.value) {
        treeRef.value.expandNode(defaultExpendKey.value, true);
      }
    }, 300);
  });
});

const loadTreeRoot = async () => {
  const { data } = await listOrgByParentId("0");
  if (data) {
    if (data.length == 1) {
      defaultExpendKey.value = data[0].id;
    }
    data.forEach((item) => {
      item.path = item.name;
      if (item.children) {
        item.children.forEach(child => {
          child.path = item.path + "/" + child.name;
        });
      }
    });
    treeData.value = data;
  }
};

const loadTreeMore = (node) => {
  return new Promise((resolve) => {
    listOrgByParentId(node.id).then(res => {
      let data = res.data;
      data.forEach((item) => {
        item.path = node.path + "/" + item.name;
      });
      node.children = data;
      resolve();
    });
  });
};

const selected = ref();

const handleClickTreeNode = (selectedKeys, data) => {
  selected.value = unref(data.node);
};
const handleOk = () => {
  emits("select", selected.value);
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};

const init = (data) => {
  title.value = data?.title;
  selected.value = data?.selected;
  visible.value = true;
};

defineExpose({ init });
</script>
<style scoped lang="less">

</style>
