<template>
  <!-- 非网关节点 -->
  <div class="node-wrap" v-if="[NODE.START, NODE.APPROVE, NODE.COPY, NODE.TRANSACT].includes(nodeConfig.type)">
    <div class="node-wrap-box" :class="{ 'start-node': nodeConfig.type == NODE.START }">
      <div class="title" :style="{ background: nodeBgColor }">
        <!-- 开始节点 -->
        <span v-if="nodeConfig.type == NODE.START">{{ nodeConfig.name }}</span>
        <!-- 任务、办理、抄送节点 -->
        <template v-else>
          <!-- <span class="iconfont-approval-admin">{{ nodeConfig.type == 1 ? "&#xe658" : "&#xe656" }}</span> -->
          <input
              v-if="isNodeNameEdit"
              type="text"
              class="editable-title-input"
              @blur="onNameInputBlur()"
              @focus="$event.currentTarget.select()"
              v-focus
              v-model="nodeConfig.name"
              :maxlength="16"
              :placeholder="nodeDefaultName" />
          <template v-else>
            <span class="editable-title">
              <span @click="onNameInputClick()">{{ nodeConfig.name }}</span>
            </span>
            <icon-close class="close" :size="14" @click="onNodeRemove" />
          </template>
        </template>
      </div>
      <div class="content" @click="onNodeCardClick">
        <!-- 发起人节点 -->
        <a-tooltip v-if="nodeConfig.type == NODE.START" :content="showNodeContent" mini content-class="node-content-tooltip">
          <span class="text">{{ nodeDefaultName }}：{{ showNodeContent }}</span>
        </a-tooltip>
        <!-- 审核人、抄送人、办理人节点 -->
        <template v-else-if="[NODE.APPROVE, NODE.COPY, NODE.TRANSACT].includes(nodeConfig.type)">
          <span class="placeholder" v-if="!showNodeContent">请选择{{ nodeDefaultName }}</span>
          <a-tooltip v-else mini :content="showNodeContent" content-class="node-content-tooltip">
            <span class="text">{{ nodeDefaultName }}：{{ showNodeContent }} </span>
          </a-tooltip>
        </template>
        <div style="color: #a1a5ad">
          <icon-right />
        </div>
      </div>
    </div>
    <AddNode v-model:childNodeP="nodeConfig.childNode" />
  </div>

  <!-- 网关节点 -->
  <div class="branch-wrap" v-if="nodeConfig.type == NODE.EXCLUSIVE_GATEWANY">
    <div class="branch-box-wrap">
      <div class="branch-box">
        <button class="add-branch" @click="onConditionAdd()">
          <icon-plus />
          添加条件
        </button>
        <!-- 网关分支节点 -->
        <div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
          <div class="condition-node">
            <div class="condition-node-box">
              <!-- 默认分支条件 -->
              <div class="auto-judge default-branch-node" v-if="isDefaultBranchNode(index)">
                <div class="title-wrapper">
                  <span class="editable-title">默认条件</span>
                  <span class="priority-title">优先级{{ item.priorityLevel }}</span>
                </div>
                <div class="content-wrapper">
                  <div class="content">未满足时其他条件时，将进入默认流程</div>
                </div>
              </div>
              <!-- 其他分支条件 -->
              <div v-else class="auto-judge">
                <div class="title-wrapper">
                  <input
                      v-if="nodeNameInputList[index]"
                      type="text"
                      class="editable-title-input"
                      @blur="onNameInputBlur(index)"
                      @focus="$event.currentTarget.select()"
                      :maxlength="16"
                      v-focus
                      v-model="item.name" />
                  <template v-else>
                    <span class="editable-title" @click="onNameInputClick(index)"> {{ item.name }} </span>
                    <span class="priority-title">优先级{{ item.priorityLevel }}</span>
                    <a-link class="close" @click="onConditionRemove(index)">
                      <template #icon>
                        <icon-close />
                      </template>
                    </a-link>
                  </template>
                </div>
                <div class="content-wrapper">
                  <div class="sort-left" v-if="index != 0" @click="branchSwitchIdx(index, -1)">
                    <icon-left />
                  </div>
                  <div class="content" @click="onNodeCardClick(item.priorityLevel)">
                    <span v-if="(getGatewayBranch(nodeConfig, index).conditionGroups || []).length == 0" class="placeholder">请设置条件</span>
                    <!-- 卡片上显示分支条件 -->
                    <a-tooltip v-else mini :content="showConditionContent(nodeConfig, index)" content-class="node-content-tooltip">
                      <span class="text">{{ showConditionContent(nodeConfig, index) }}</span>
                    </a-tooltip>
                  </div>
                  <div
                      class="sort-right"
                      v-if="index != nodeConfig.conditionNodes.length - 1 && !isDefaultBranchNode(index + 1)"
                      @click="branchSwitchIdx(index)">
                    <icon-right />
                  </div>
                </div>
              </div>
              <AddNode v-model:childNodeP="item.childNode" />
            </div>
          </div>
          <NodeWrap v-if="item.childNode" v-model:nodeConfig="item.childNode" />
          <template v-if="index == 0">
            <div class="top-left-cover-line"></div>
            <div class="bottom-left-cover-line"></div>
          </template>
          <template v-if="index == nodeConfig.conditionNodes.length - 1">
            <div class="top-right-cover-line"></div>
            <div class="bottom-right-cover-line"></div>
          </template>
        </div>
      </div>
      <AddNode v-model:childNodeP="nodeConfig.childNode" />
    </div>
  </div>

  <!-- 分支汇合节点 -->
  <NodeWrap v-if="nodeConfig.childNode" v-model:nodeConfig="nodeConfig.childNode" />
</template>

<script setup>
import { useFlowStore } from "@/store/index";
import { IconClose, IconLeft, IconPlus, IconRight } from "@arco-design/web-vue/es/icon";
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import { NODE } from "./common/FlowConstant";
import { showExpNodeContent } from "./common/FormExp";
import AddNode from "@/components/flow/AddNode.vue";

let _uid = getCurrentInstance().uid;

// 属性
let props = defineProps({
  nodeConfig: {
    type: Object, default: () => {
    },
  },
  flowPermission: {
    type: Object, default: () => {
    },
  },
});

let emits = defineEmits(["update:flowPermission", "update:nodeConfig"]);
let flowStore = useFlowStore();
let {
  flowDefinition,
  showPromoterDrawer,
  showApproverDrawer,
  showCopyerDrawer,
  showConditionDrawer,
  showTransactorDrawer,
  setPromoterConfig,
  setApproverConfig,
  setCopyerConfig,
  setConditionsConfig,
  setTransactorConfig,
} = flowStore;
let promoterConfig0 = computed(() => flowStore.promoterConfig0);
let approverConfig0 = computed(() => flowStore.approverConfig0);
let copyerConfig0 = computed(() => flowStore.copyerConfig0);
let conditionsConfig0 = computed(() => flowStore.conditionsConfig0);
let transactorConfig0 = computed(() => flowStore.transactorConfig0);

// 节点基本信息
let nodeSettings = reactive({
  [NODE.START]: { placeholder: "发起人", bgColor: "#a9b4cd" },
  [NODE.APPROVE]: { placeholder: "审批人", bgColor: "#ff943e" },
  [NODE.COPY]: { placeholder: "抄送人", bgColor: "#3296fa" },
  [NODE.TRANSACT]: { placeholder: "办理人", bgColor: "#926bd5" },
});
let nodeDefaultName = computed(() => nodeSettings[props.nodeConfig.type].placeholder);
let nodeBgColor = computed(() => nodeSettings[props.nodeConfig.type].bgColor);

// nodeType 0发起人 1审批 2抄送 3条件 4路由
// 节点卡片显示的内容
let showNodeContent = computed(() => {
  let nodeType = props.nodeConfig.type;
  if (nodeType == NODE.START) {
    // 开始节点
    let { type, flowInitiators } = props.flowPermission;
    if (type == 0) return "全员可提交";
    else if (type == 2) return "均不可提交";
    else return flowInitiators?.map((i) => i.name).join(", ");
  } else if (nodeType == NODE.APPROVE) {
    // 审批人节点
    let { assignees, approvalType } = props.nodeConfig;
    if (approvalType == 1) return "自动通过";
    else if (approvalType == 2) return "自动拒绝";
    else {
      return assignees
          .map((assignee) => {
            let { assigneeType, assignees } = assignee;
            if (assigneeType == 0) {
              return "发起人本人";
            } else if (assigneeType == 1) {
              return "发起人部门负责人";
            } else if (assigneeType == 2) {
              return assignees?.map((user) => user.name).join(", ");
            } else if (assigneeType == 3) {
              return assignees?.map((user) => user.name).join(", ");
            } else if (assigneeType == 10) {
              return "发起人自选";
            } else if (assigneeType == 11) {
              return "审批人规则";
            }
          })
          .join(", ");
    }
  }
  return null;
});

// 分支卡片显示的内容
let showConditionContent = (nodeConfig, index) => {
  let branchNode = nodeConfig.conditionNodes[index];
  // console.log("条件分支：", branchNode);
  return showExpNodeContent(branchNode, flowDefinition.flowWidgets);
};
let getGatewayBranch = (gateway, index) => {
  return gateway.conditionNodes[index];
};
// 是否为默认分支节点
const isDefaultBranchNode = (idx) => {
  return props.nodeConfig.conditionNodes.length == idx + 1;
};

watch(promoterConfig0, (flowPermission) => {
  if (flowPermission.flag && flowPermission.id === _uid) {
    emits("update:flowPermission", flowPermission.value);
  }
});
watch(approverConfig0, (approver) => {
  if (approver.flag && approver.id === _uid) {
    console.log("t3", approver);
    emits("update:nodeConfig", approver.value);
  }
});
watch(transactorConfig0, (transactor) => {
  if (transactor.flag && transactor.id === _uid) {
    emits("update:nodeConfig", transactor.value);
  }
});
watch(copyerConfig0, (copyer) => {
  if (copyer.flag && copyer.id === _uid) {
    emits("update:nodeConfig", copyer.value);
  }
});
watch(conditionsConfig0, (condition) => {
  if (condition.flag && condition.id === _uid) {
    emits("update:nodeConfig", condition.value);
  }
});

let nodeNameInputList = ref([]);
let isNodeNameEdit = ref(false);

// 节点名称点击事件
const onNameInputClick = (index) => {
  if (index || index === 0) {
    nodeNameInputList.value[index] = true;
  } else {
    isNodeNameEdit.value = true;
  }
};

// 节点名称离开事件
const onNameInputBlur = (index) => {
  if (index || index === 0) {
    nodeNameInputList.value[index] = false;
    props.nodeConfig.conditionNodes[index].name = props.nodeConfig.conditionNodes[index].name || "条件";
  } else {
    isNodeNameEdit.value = false;
    props.nodeConfig.name = props.nodeConfig.name || nodeDefaultName;
  }
};

// 删除节点
const onNodeRemove = () => {
  emits("update:nodeConfig", props.nodeConfig.childNode);
};

// 新增分支条件
const onConditionAdd = () => {
  let len = props.nodeConfig.conditionNodes.length + 1;
  props.nodeConfig.conditionNodes.push({
    name: "条件" + len,
    type: 3,
    priorityLevel: len,
    conditionList: [],
    childNode: null,
  });
  emits("update:nodeConfig", props.nodeConfig);
};

// 删除分支条件
const onConditionRemove = (index) => {
  props.nodeConfig.conditionNodes.splice(index, 1);
  props.nodeConfig.conditionNodes.map((item, index) => {
    item.priorityLevel = index + 1;
    item.name = `条件${index + 1}`;
  });
  emits("update:nodeConfig", props.nodeConfig);
  if (props.nodeConfig.conditionNodes.length == 1) {
    if (props.nodeConfig.childNode) {
      if (props.nodeConfig.conditionNodes[0].childNode) {
        reconnectNode(props.nodeConfig.conditionNodes[0].childNode, props.nodeConfig.childNode);
      } else {
        props.nodeConfig.conditionNodes[0].childNode = props.nodeConfig.childNode;
      }
    }
    emits("update:nodeConfig", props.nodeConfig.conditionNodes[0].childNode);
  }
};

// 删除分支后重新连接节点
const reconnectNode = (data, addData) => {
  if (!data.childNode) {
    data.childNode = addData;
  } else {
    reconnectNode(data.childNode, addData);
  }
};

// type 0 发起人 1审批 2抄送 3条件 4路由
// 如果是非分支节点，则不需要传递参数
// 节点卡片点击
const onNodeCardClick = (priorityLevel) => {
  var { type } = props.nodeConfig;
  console.log("node_uid", _uid, type);
  if (type == NODE.START) {
    // 发起人
    showPromoterDrawer(true);
    setPromoterConfig({
      value: JSON.parse(JSON.stringify(props.flowPermission)),
      flag: false,
      id: _uid,
    });
  } else if (type == NODE.APPROVE) {
    // 审批人
    showApproverDrawer(true);
    setApproverConfig({
      value: JSON.parse(JSON.stringify(props.nodeConfig)),
      flag: false,
      id: _uid,
    });
  } else if (type == NODE.COPY) {
    // 抄送人
    showCopyerDrawer(true);
    setCopyerConfig({
      value: JSON.parse(JSON.stringify(props.nodeConfig)),
      flag: false,
      id: _uid,
    });
  } else if (type == NODE.TRANSACT) {
    // 办理人
    showTransactorDrawer(true);
    setTransactorConfig({
      value: JSON.parse(JSON.stringify(props.nodeConfig)),
      flag: false,
      id: _uid,
    });
  } else if (type == NODE.EXCLUSIVE_GATEWANY) {
    // 分支条件
    showConditionDrawer(true);
    setConditionsConfig({
      value: JSON.parse(JSON.stringify(props.nodeConfig)),
      priorityLevel,
      flag: false,
      id: _uid,
    });
  }
};

// 分支条件交换位置
const branchSwitchIdx = (index, type = 1) => {
  //向左-1,向右1
  props.nodeConfig.conditionNodes[index] = props.nodeConfig.conditionNodes.splice(index + type, 1, props.nodeConfig.conditionNodes[index])[0];
  props.nodeConfig.conditionNodes.map((item, index) => {
    item.priorityLevel = index + 1;
  });
  emits("update:nodeConfig", props.nodeConfig);
};

onMounted(() => {
  // if (props.nodeConfig.type == 1) {
  //   props.nodeConfig.error = !$func.setApproverStr(props.nodeConfig);
  // } else if (props.nodeConfig.type == 2) {
  //   props.nodeConfig.error = !$func.copyerStr(props.nodeConfig);
  // } else if (props.nodeConfig.type == 4) {
  //   resetConditionNodesErr();
  // }
});
</script>

<style lang="less">
@import './NodeWrap.less';
</style>
