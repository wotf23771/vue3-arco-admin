<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <a-popover
          :popup-visible="visible"
          position="rt"
          popup-container=".flow-desgin-main"
          content-class="add-node-btn-box-wrap"
          trigger="click"
          :show-arrow="false"
          @popup-visible-change="onPopupStatusChange">
        <template #content>
          <div class="add-node-popover-wrap">
            <div class="add-node-popover-item approver" @click="onNodeAddClicked(NODE.APPROVE)">
              <div class="node-icon"><span class="iconfont-approval-admin" v-html="icons[NODE.APPROVE].icon"></span></div>
              <div class="node-text">审批人</div>
            </div>
            <!--            <div class="add-node-popover-item copyer" @click="onNodeAddClicked(NODE.COPY)">-->
            <!--              <div class="node-icon"><span class="iconfont-approval-admin" v-html="icons[NODE.COPY].icon"></span></div>-->
            <!--              <div class="node-text">抄送人</div>-->
            <!--            </div>-->
            <!--            <div class="add-node-popover-item transactor" @click="onNodeAddClicked(NODE.TRANSACT)">-->
            <!--              <div class="node-icon"><span class="iconfont-approval-admin" v-html="icons[NODE.TRANSACT].icon"></span></div>-->
            <!--              <div class="node-text">办理人</div>-->
            <!--            </div>-->
            <div class="add-node-popover-item condition" @click="onNodeAddClicked(NODE.EXCLUSIVE_GATEWANY)">
              <div class="node-icon"><span class="iconfont-approval-admin" v-html="icons[NODE.EXCLUSIVE_GATEWANY].icon"></span>
              </div>
              <div class="node-text">条件分支</div>
            </div>
          </div>
        </template>
        <button class="btn" type="button">
          <icon-plus />
        </button>
      </a-popover>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, toRaw } from "vue";
import { useFlowStore } from "@/store/index";
import Snowflake from "./common/Snowflake";
import { NODE } from "./common/FlowConstant";
import ObjectUtil from "./common/ObjectUtil";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { filterConditionWidgets, initNodeFormAuth } from "./common/FormAuth";

let emits = defineEmits(["update:childNodeP"]);
let visible = ref(false);
let props = defineProps({
  childNodeP: { type: Object, default: () => null },
});

// 节点图标
let icons = reactive({
  [NODE.APPROVE]: { icon: "&#xe658" },
  [NODE.COPY]: { icon: "&#xe656" },
  [NODE.EXCLUSIVE_GATEWANY]: { icon: "&#xe63f" },
  [NODE.TRANSACT]: { icon: "&#xe6cd" },
});
// icons[NODE.APPROVE] = { icon: "&#xe658" };
// icons[NODE.COPY] = { icon: "&#xe656" };
// icons[NODE.EXCLUSIVE_GATEWANY] = { icon: "&#xe63f" };
// icons[NODE.TRANSACT] = { icon: "&#xe6cd" };

// 流程定义
let flowStore = useFlowStore();
let { flowDefinition } = flowStore;
let workFlowDef = computed(() => flowDefinition.workFlowDef);

const onPopupStatusChange = (is) => {
  visible.value = is;
};

// 设置节点的表单权限
const setFormAuth = (node) => {
  let disabledWidgets = [];
  filterConditionWidgets(flowDefinition.nodeConfig, disabledWidgets);
  let widgets = ObjectUtil.copy(toRaw(flowDefinition.flowWidgets || []));
  initNodeFormAuth(node, widgets, disabledWidgets);
};

// 新增节点
const onNodeAddClicked = (type) => {
  visible.value = false;
  if (type != NODE.EXCLUSIVE_GATEWANY) {
    let newNode;
    if (type == NODE.APPROVE) {
      newNode = {
        name: "审批",
        type: NODE.APPROVE,
        approvalType: 0,
        multiInstanceApprovalType: 0,
        flowNodeNoAuditorType: 0,
        flowNodeSelfAuditorType: 0,
        assignees: [{ rid: Snowflake.generate(), assigneeType: 0 }], // 审批人
        assignable: true, // 可转交
        signable: true, // 可变签
        backable: true, // 可回退
        backSubmitType: true, // 驳回跳转提交
        childNode: props.childNodeP,
      };
      setFormAuth(newNode); // 设置节点的表单权限
    } else if (type == NODE.COPY) {
      newNode = {
        name: "抄送",
        type: NODE.COPY,
        ccs: [{ rid: Snowflake.generate(), ccType: 0 }], // 抄送人
        childNode: props.childNodeP,
      };
    } else if (type == NODE.TRANSACT) {
      newNode = {
        name: "办理",
        type: NODE.TRANSACT,
        approvalType: 0,
        multiInstanceApprovalType: 0,
        flowNodeNoAuditorType: 2,
        flowNodeAuditAdmin: workFlowDef.value.flowAdminIds[0],
        transactors: [{ rid: Snowflake.generate(), transactorType: 0 }], // 办理人
        assignable: true, // 可转交
        childNode: props.childNodeP,
      };
      setFormAuth(newNode); // 设置节点的表单权限
    }
    emits("update:childNodeP", newNode);
  } else {
    let newNode = {
      name: "排他网关",
      type: NODE.EXCLUSIVE_GATEWANY,
      childNode: null,
      conditionNodes: [
        { name: "条件1", type: NODE.CONDITION, priorityLevel: 1, conditionGroups: [], childNode: props.childNodeP },
        { name: "条件2", type: NODE.CONDITION, priorityLevel: 2, conditionGroups: [], childNode: null },
      ],
    };
    emits("update:childNodeP", newNode);
  }
};
</script>

<style scoped lang="less">
@import "./AddNode.less";
</style>
