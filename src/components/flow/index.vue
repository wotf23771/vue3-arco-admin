<template>
  <div>
    <div class="flow-desgin">
      <section class="flow-desgin-main">
        <!-- 编辑界面缩放 -->
        <div class="zoom">
          <div class="zoom-out" :class="nowScale == 50 && 'disabled'" @click="zoomSize(1)">
            <icon-minus />
          </div>
          <span>{{ nowScale }}%</span>
          <div class="zoom-in" :class="nowScale == 300 && 'disabled'" @click="zoomSize(2)">
            <icon-plus />
          </div>
        </div>

        <!-- 流程节点界面 -->
        <div class="box-scale" :style="`transform: scale(${nowScale / 100});`">
          <!-- 绘制节点 -->
          <NodeWrap v-model:nodeConfig="nodeConfig" v-model:flowPermission="flowPermission" />
          <div class="node-wrap">
            <div class="node-wrap-box end-node">
              <div class="title">结束</div>
              <div class="content">流程结束</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <PromoterDrawer></PromoterDrawer>
    <ApproverDrawer></ApproverDrawer>
    <CopyerDrawer></CopyerDrawer>
    <ConditionDrawer></ConditionDrawer>
    <TransactDrawer></TransactDrawer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useFlowStore } from "@/store/index";
import ApproverDrawer from "@/components/flow/drawer/ApproverDrawer.vue";
import ConditionDrawer from "@/components/flow/drawer/ConditionDrawer.vue";
import CopyerDrawer from "@/components/flow/drawer/CopyerDrawer.vue";
import PromoterDrawer from "@/components/flow/drawer/PromoterDrawer.vue";
import TransactDrawer from "@/components/flow/drawer/TransactDrawer.vue";
import { IconMinus, IconPlus } from "@arco-design/web-vue/es/icon";

let { flowDefinition, setFlowDefId } = useFlowStore();
const router = useRouter();

let nowScale = ref(100);
let nodeConfig = ref({});
let workFlowDef = ref({});
let flowPermission = ref({});
let flowWidgets = ref([]); // 作为分支条件的组件

const loadFlowData = (flowDefinition) => {
  console.log("def", flowDefinition);
  const { nodeConfig: nodeConfig0, flowPermission: flowPermission0, workFlowDef: workFlowDef0, flowWidgets: flowWidgets0 } = flowDefinition;
  nodeConfig.value = nodeConfig0;
  flowPermission.value = flowPermission0;
  // workFlowDef.value = workFlowDef0;
  flowWidgets.value = flowWidgets0;
  setFlowDefId(workFlowDef0.id);
};

watch(flowPermission, () => {
  flowDefinition.flowPermission = flowPermission.value;
});

watch(nodeConfig, () => {
  flowDefinition.nodeConfig = nodeConfig.value;
});

onMounted(async () => {
  if (flowDefinition == undefined) {
    router.push("/flowmanindex");
  } else {
    loadFlowData(flowDefinition);
  }
});

// 缩放
const zoomSize = (type) => {
  if (type == 1) {
    if (nowScale.value > 50) {
      nowScale.value -= 10;
    }
  } else {
    if (nowScale.value < 300) {
      nowScale.value += 10;
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
