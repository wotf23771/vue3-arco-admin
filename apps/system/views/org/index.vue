<template>
  <div class="container">
    <Breadcrumb :items="['系统设置', '组织管理']" />
    <a-card style="height:calc(100vh - 170px);overflow: auto;" :bordered="false">
      <div style="display: flex">
        <a-resize-box :directions="['right']" style="width:260px;height:calc(100vh - 205px);">
          <a-tree
              ref="treeRef"
              :field-names="treeFieldNames"
              :data="treeData"
              :load-more="loadTreeMore"
              :expanded-keys="expendKeys"
              :selected-keys="selectedKeys"
              @expand="(keys, _) => { expendKeys = keys }"
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
        </a-resize-box>
        <div style="flex: 1;overflow: auto">
          <org-list ref="orgListRef" :parent-id="currentOrgId" @update="updateCurrentNodeChildren"></org-list>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
export default {
  name: "Org",
};
</script>
<script setup>
import { onMounted, ref, unref } from "vue";
import { listOrgByParentId } from "../../api/orgApi";
import OrgList from "./OrgList.vue";
import { IconHome } from "@arco-design/web-vue/es/icon";

const treeRef = ref();
const treeFieldNames = {
  key: "id",
  title: "name",
};
const selectedKeys = ref([]);
const treeData = ref([]);

onMounted(() => {
  loadTreeRoot();
});

const loadTreeRoot = async () => {
  const { data } = await listOrgByParentId("0");
  if (data) {
    let rootId = data[0].id;
    currentNode.value = data[0];
    currentOrgId.value = data[0].id;
    if (data.length == 1) {
      expendKeys.value = [];
      expendKeys.value.push(rootId);
      selectedKeys.value.push(rootId);
    }
  }
  treeData.value = data;
};

const loadTreeMore = (node) => {
  return new Promise((resolve) => {
    listOrgByParentId(node.id).then(res => {
      node.children = res.data;
      resolve();
    });
  });
};

const currentOrg = ref();
const currentOrgId = ref();
const currentNode = ref();

const updateCurrentNodeChildren = () => {
  console.log("currentNode", currentNode.value);
  if (currentNode.value) {
    listOrgByParentId(currentNode.value.id).then(res => {
      currentNode.value.children = res.data;
    });
  }
};

const handleClickTreeNode = (_selectedKeys, data) => {
  selectedKeys.value = _selectedKeys;
  currentOrg.value = unref(data.node);
  currentOrgId.value = currentOrg.value.id;
  currentNode.value = data.node;
};
// 打开的节点KEY
const expendKeys = ref([]);
const orgListRef = ref();
</script>

<style scoped lang="less">
.container {
  padding: 0 20px;
}
</style>
