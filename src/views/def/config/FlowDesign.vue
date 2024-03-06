<template>
  <a-spin :loading="loading">
    <div class="fd-main">
      <div class="fd-main-box" v-dragscroll>
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
    </div>
  </a-spin>
</template>

<script setup>
import { onMounted, ref, toRaw, watch } from "vue";
import { useRouter } from "vue-router";
import { useFlowStore } from "@/store/index";
import ApproverDrawer from "@/components/flow/drawer/ApproverDrawer.vue";
import ConditionDrawer from "@/components/flow/drawer/ConditionDrawer.vue";
import CopyerDrawer from "@/components/flow/drawer/CopyerDrawer.vue";
import PromoterDrawer from "@/components/flow/drawer/PromoterDrawer.vue";
import TransactDrawer from "@/components/flow/drawer/TransactDrawer.vue";
import { IconMinus, IconPlus } from "@arco-design/web-vue/es/icon";
import NodeWrap from "@/components/flow/NodeWrap.vue";
import "@/components/flow/style/index.less";
import { Message } from "@arco-design/web-vue";
import { getProcDef,getProcDefByVersion,updateProcDef } from "@/api/def/config";

const emits = defineEmits(["success"]);
let { flowDefinition, setFlowDefId } = useFlowStore();
const flowStore = useFlowStore();
const router = useRouter();

let nowScale = ref(100);
let nodeConfig = ref({});
let workFlowDef = ref({});
let flowPermission = ref({});
let flowWidgets = ref([]); // 作为分支条件的组件

const loadFlowData = (flowDefinition) => {
  const { nodeConfig: nodeConfig0, flowPermission: flowPermission0, workFlowDef: workFlowDef0, flowWidgets: flowWidgets0 } = flowDefinition;
  nodeConfig.value = nodeConfig0;
  flowPermission.value = flowPermission0;
  workFlowDef.value = workFlowDef0;
  flowWidgets.value = flowWidgets0;
  flowStore.setFlowDefId(workFlowDef0.id);
};

watch(flowPermission, () => {
  flowDefinition.flowPermission = flowPermission.value;
});

watch(nodeConfig, () => {
  flowDefinition.nodeConfig = nodeConfig.value;
});

onMounted(async () => {
  console.log("flow.index", flowDefinition);

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

const loading = ref(false);
const id = ref('');
const init = async (record) => {
  id.value = record.id;
  let flowDef = {
    workFlowDef: { name: null, icon: "approval", flowAdminIds: ["admin"], cancelable: 1 },
    nodeConfig: { name: "发起", type: 0 },
    flowPermission: { type: 0 },
  };

  const { success, data, message } = await getProcDef(id.value);
  if (success) {
    if (data && data.process) {
      flowDef.nodeConfig = JSON.parse(data.process);
    }
  }


  flowStore.setFlowDef(flowDef);
  // flowStore.setFlowGroups(groups.value);
  loadFlowData(flowDef);
};

const initByProcDefVersion = async (record) => {

  let flowDef = {
    workFlowDef: { name: null, icon: "approval", flowAdminIds: ["admin"], cancelable: 1 },
    nodeConfig: { name: "发起", type: 0 },
    flowPermission: { type: 0 },
  };

  const { success, data, message } = await getProcDefByVersion(record.id);
  if (success) {
    if (data && data.process) {
      id.value = data.id;
      flowDef.nodeConfig = JSON.parse(data.process);
    }
  }


  flowStore.setFlowDef(flowDef);
  // flowStore.setFlowGroups(groups.value);
  loadFlowData(flowDef);
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    // let flowDef = JSON.parse(JSON.stringify(toRaw(flowDefinition)));
    let flowDef = JSON.stringify(toRaw(flowDefinition.nodeConfig));
    console.log(flowDef);
    // Message.success("更新成功");
    // emits("success");
    var form = {
      process: flowDef
    };
    const { code, success, message } = await updateProcDef(id.value,form);
    if (!success) {
      Message.error(message || "更新失败");
      return false;
    }
    Message.success("更新成功");
    emits("success");
    return false;
  } catch (err) {
    console.log("err", err);
    return false;
  } finally {
    loading.value = false;
  }
};

defineExpose({ init,initByProcDefVersion, handleSubmit });
</script>

<style lang="less">
// @canvas-bg: #f5f5f7;
@canvas-bg: #f2f3f5;
.fd-main {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 70px;
  background-color: @canvas-bg;
  overflow: hidden;

  .fd-main-box {
    height: 100%;
    overflow-y: auto;
  }
}

.flow-desgin {
  height: 100%;
  z-index: 1;
  cursor: grab;
}

.flow-desgin-main {
  width: 100%;
  background-color: @canvas-bg;
  user-select: none;

  .zoom {
    display: flex;
    position: fixed;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    height: 40px;
    width: 125px;
    right: 40px;
    margin-top: 30px;
    z-index: 10;

    .zoom-in,
    .zoom-out {
      width: 30px;
      height: 30px;
      background: #fff;
      color: #c1c1cd;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      color: #111;
      border-radius: 50%;
      transition: all 0.5s ease;

      &:hover {
        // transform: scale(1.1);
        box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
      }

      &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 50%;
        border: 1px solid transparent;
        box-shadow: 0 2px 5px #0000001a;
      }
    }

    .zoom-in.disabled,
    .zoom-out.disabled {
      opacity: 0.5;
    }
  }

  .box-scale {
    transform: scale(1);
    display: inline-block;
    position: relative;
    width: 100%;
    padding: 54.5px 0;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    min-width: min-content;
    transform-origin: 50% 0px 0px;
  }

  .end-node {
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    &::before {
      content: "";
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 4px;
      border-style: solid;
      border-width: 8px 6px 4px;
      border-color: #cacaca transparent transparent;
    }

    .title {
      height: 28px;
      border-radius: 8px 8px 0 0;
      background: #a9b4cd;
      padding: 0 12px;
    }

    .content {
      color: #646a73;
    }
  }
}
</style>
