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
      <icon-select-all />
      {{ title }}
    </template>
    <div v-if="visible" style="height:400px;">
      <a-tree
          ref="treeRef"
          :field-names="treeFieldNames"
          :data="treeData"
          :expanded-keys="expendKeys"
          :selected-keys="selectedKeys"
          @select="handleClickTreeNode"
          @expand="handleExpand"
          block-node>
        <template #switcher-icon>
          <IconDown />
        </template>
        <template #icon="{ node }">
          <IconHome v-if="node.type==1" />
          <IconStorage v-if="node.type==2" />
        </template>
        <template #title="{id,name}">
          {{ name }}
          <icon-check v-if="selectedKeys.includes(id)" />
        </template>
      </a-tree>
    </div>
  </a-modal>
</template>

<script setup>

import { ref } from "vue";
import { IconHome } from "@arco-design/web-vue/es/icon";
import { loadUserUnionTreeData } from "../../../api/roleApi";

const emits = defineEmits(["select"]);
const visible = ref(false);
const title = ref("");

const treeRef = ref();
const treeFieldNames = {
  key: "id",
  title: "name",
  children: "children",
};
// 打开的节点KEY
const expendKeys = ref([]);
const treeData = ref([]);

const loadTreeRoot = async () => {
  const { data } = await loadUserUnionTreeData("");
  if (data) {
    treeData.value = data;
    if (data.length == 1) {
      expendKeys.value.push(data[0].id);
    }
  }
};

const selectedKeys = ref([]);

const handleExpand = (keys, data) => {
  expendKeys.value = keys;
};
const handleClickTreeNode = (keys, data) => {
  selectedKeys.value = keys;
};
const handleOk = () => {
  let selectedNodes = treeRef.value.getSelectedNodes();
  if (selectedNodes) {
    emits("select", selectedNodes[0]);
  } else {
    emits("select", undefined);
  }
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
};

const init = (data) => {
  title.value = data?.title;
  visible.value = true;
  selectedKeys.value = [];
  if (data?.selected) {
    selectedKeys.value.push(data.selected);
  }
  expendKeys.value = [];
  loadTreeRoot();
};

defineExpose({ init });
</script>
<style scoped lang="less">

</style>
