<template>
  <a-layout style="height: calc(100vh - 107px);margin: 0 2px;">
    <a-layout>
      <a-layout-sider :width="240" style="padding:10px;">
        <a-tree
            ref="treeRef"
            :field-names="treeFieldNames"
            :data="treeData"
            :load-more="loadTreeMore"
            :expanded-keys="expendKeys"
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
      </a-layout-sider>
      <a-layout-content>
        <org-user-list
            ref="orgUserListRef"
            :org-id="currentOrgId"
            :org-type="currentOrgType"
            :org-name="currentOrgName"
        >
        </org-user-list>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { onMounted, ref, unref } from "vue";
import { listOrgByParentId } from "../../api/orgApi";
import OrgUserList from "./OrgUserList.vue";
import { IconHome } from "@arco-design/web-vue/es/icon";

const treeRef = ref();
const treeFieldNames = {
  key: "id",
  title: "name",
  children: "children",
};

const treeData = ref([]);

onMounted(() => {
  loadTreeRoot();
});

const loadTreeRoot = async () => {
  const { data } = await listOrgByParentId("0");
  if (data) {
    currentOrgId.value = data[0].id;
    currentOrgType.value = data[0].type;
    currentOrgName.value = data[0].name;
    if (data.length == 1) {
      expendKeys.value = [];
      expendKeys.value.push(data[0].id);
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

const currentOrg = ref();
const currentOrgId = ref();
const currentOrgType = ref();
const currentOrgName = ref();

const handleClickTreeNode = (selectedKeys, data) => {
  currentOrg.value = unref(data.node);
  currentOrgId.value = currentOrg.value.id;
  currentOrgType.value = currentOrg.value.type;
  currentOrgName.value = currentOrg.value.path;
};
// 默认打开的节点KEY
const expendKeys = ref([]);
const orgUserListRef = ref();

</script>

<style scoped lang="less">

</style>
