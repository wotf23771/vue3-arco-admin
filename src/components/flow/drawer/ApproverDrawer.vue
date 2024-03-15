<!-- 设置审批人 -->
<template>
  <a-drawer
      v-if="visible"
      :append-to-body="true"
      :width="540"
      :visible="visible"
      :closable="false"
      @cancel="close()"
      @ok="saveApprover()"
      ok-text="保存">
    <template #title>
      <EditableText :value="flowNodeConfig.name" @change="onNodeNameChange" />
    </template>

    <div class="approver-drawer__content">
      <!-- 节点审批类型 -->
      <div class="approval-editor-node-type-wrapper">
        <div class="item-key-wrapper">
          <div class="item-key">审批类型</div>
        </div>
        <div class="item-content">
          <a-radio-group v-model="flowNodeConfig.approvalType">
            <a-radio :value="0">人工审批</a-radio>
            <a-radio :value="1">自动通过</a-radio>
            <a-radio :value="2">自动拒绝</a-radio>
          </a-radio-group>
        </div>
      </div>

      <!-- 审批人选择界面 -->
      <div class="approval-editor-tab-wrapper" v-if="flowNodeConfig.approvalType == 0">
        <a-radio-group type="button" v-model="viewEditorType" size="large">
          <a-radio :value="0">审批人</a-radio>
          <a-radio :value="1">表单</a-radio>
          <a-radio :value="2">操作</a-radio>
          <a-radio :value="3">事件</a-radio>
          <a-radio :value="4">参数</a-radio>
        </a-radio-group>

        <!-- 审批人 -->
        <div class="item-content-editor" v-if="viewEditorType == 0">
          <div class="content-wrap">
            <div class="item-content">
              <!-- 审批人列表 -->
              <div class="item-wrap approver">
                <div class="approver-list">
                  <div class="approver-wrapper" v-for="(item, idx) in flowNodeConfig.assignees">
                    <div class="header">
                      <span>审批人</span>
                    </div>
                    <div class="main-content">
                      <a-radio-group class="radio-group" v-model="item.assigneeType" @change="onAssigneeTypeChanged(item)">
                        <a-grid :cols="3" :colGap="0" :rowGap="10">
                          <a-grid-item>
                            <a-radio :value="0">发起人本人</a-radio>
                          </a-grid-item>
                          <a-grid-item>
                            <a-radio :value="1">发起人部门负责人</a-radio>
                          </a-grid-item>
                          <a-grid-item>
                            <a-radio :value="2">指定部门负责人</a-radio>
                          </a-grid-item>
                          <a-grid-item>
                            <a-radio :value="3">指定成员</a-radio>
                          </a-grid-item>
                          <a-grid-item>
                            <a-radio :value="10">发起人自选</a-radio>
                          </a-grid-item>
                          <a-grid-item>
                            <a-radio :value="11">审批人规则</a-radio>
                          </a-grid-item>
                        </a-grid>
                      </a-radio-group>
                    </div>
                    <div class="sub-content" v-if="[2, 3, 11].includes(item.assigneeType)">
                      <div class="sub-content-top-line"></div>
                      <!-- 指定部门负责人 -->
                      <template v-if="item.assigneeType == 2">
                        <p class="bold">选择部门</p>
                        <div class="assignee-box">
                          <a-button size="small" @click="onAssignee2Click(item)">
                            <icon-plus />
                          </a-button>
                          <span class="assignee-list">
                            <a-tag v-for="userId in item.assignees">{{ userId.name }}</a-tag>
                          </span>
                          <OrganChooseBox
                              v-if="showChooseAssignee2"
                              v-model:visible="showChooseAssignee2"
                              v-model:selected="selectedAssignee2.assignees"
                              :hidden-user="true" />
                        </div>
                      </template>

                      <!-- 指定成员 -->
                      <template v-if="item.assigneeType == 3">
                        <p class="bold">添加成员<span>（不能超过 25 人）</span></p>
                        <div class="assignee-box">
                          <a-button size="small" @click="onAssigneeClick(item)">
                            <icon-plus />
                          </a-button>
                          <span class="assignee-list">
                            <a-tag v-for="userId in item.assignees">{{ userId.name }}</a-tag>
                          </span>
                          <OrganChooseBox
                              v-if="showChooseAssignee4"
                              v-model:visible="showChooseAssignee4"
                              v-model:selected="selectedAssignee4.assignees"
                              :hidden-dept="true" />
                        </div>
                      </template>

                      <!-- 审批人规则 -->
                      <template v-if="item.assigneeType == 11">
                        <p class="bold">选择审批人规则</p>
                        <a-select placeholder="请选择" v-model="item.ruleId" allow-clear>
                          <a-option v-for="rule in ruleList" :value="rule.id" :label="rule.name"></a-option>
                        </a-select>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 多人审批时采用的审批方式 -->
              <div class="item-wrap sign-type" v-if="flowNodeConfig.assignees[0].assigneeType != 0">
                <div class="item-key-wrapper">
                  <div class="item-key">多人审批时采用的审批方式</div>
                </div>
                <div class="item-content">
                  <a-radio-group direction="vertical" v-model="flowNodeConfig.multiInstanceApprovalType">
                    <a-radio :value="1">会签（需所有审批人同意）</a-radio>
                    <a-radio :value="2">或签（一名审批人同意即可）</a-radio>
                  </a-radio-group>
                </div>
              </div>

              <!-- 审批人为空时 -->
              <div class="item-wrap approver-null">
                <div class="item-key-wrapper">
                  <div class="item-key">审批人为空时</div>
                </div>
                <div class="item-content">
                  <a-radio-group v-model="flowNodeConfig.flowNodeNoAuditorType">
                    <a-radio :value="0">自动通过</a-radio>
                    <a-radio :value="3">拒绝提交</a-radio>
                  </a-radio-group>
                </div>
              </div>

              <!-- 审批人为自己时 -->
              <div class="item-wrap approver-self">
                <div class="item-key-wrapper">
                  <div class="item-key">审批人与提交人为同一人时</div>
                </div>
                <div class="item-content">
                  <a-radio-group class="radio-group" v-model="flowNodeConfig.flowNodeSelfAuditorType">
                    <a-grid :cols="2" :colGap="0" :rowGap="10">
                      <a-grid-item>
                        <a-radio :value="0">由发起人对自己审批</a-radio>
                      </a-grid-item>
                      <a-grid-item>
                        <a-radio :value="1">自动跳过</a-radio>
                      </a-grid-item>
                    </a-grid>
                  </a-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 表单 -->
        <div class="item-content-auth" v-else-if="viewEditorType == 1">
          <div class="content-wrap">
            <div class="item-content">
              <a-form class="item-form">
                <a-form-item field="toDoUrl" label="待办表单">
                  <a-select v-model="flowNodeConfig.formConfig.toDoUrl" placeholder="请选择待办表单" allow-clear>
                    <a-option v-for="(item, index) in formUrlList" :key="index" :value="item.url">{{ item.name }}</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="toDoUrl" label="已办表单">
                  <a-select v-model="flowNodeConfig.formConfig.haveDoUrl" placeholder="请选择已办表单" allow-clear>
                    <a-option v-for="(item, index) in formUrlList" :key="index" :value="item.url">{{ item.name }}</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="toDoUrl" label="待阅表单">
                  <a-select v-model="flowNodeConfig.formConfig.toReadUrl" placeholder="请选择待阅表单" allow-clear>
                    <a-option v-for="(item, index) in formUrlList" :key="index" :value="item.url">{{ item.name }}</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="toDoUrl" label="已阅表单">
                  <a-select v-model="flowNodeConfig.formConfig.haveReadUrl" placeholder="请选择已阅表单" allow-clear>
                    <a-option v-for="(item, index) in formUrlList" :key="index" :value="item.url">{{ item.name }}</a-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>

        <!-- 操作 -->
        <div class="item-content-auth" v-else-if="viewEditorType == 2">
          <div class="content-wrap">
            <div class="item-content">
              <div class="item-wrap auth-list">
                <a-checkbox class="auth-item" v-model="flowNodeConfig.assignable" :value="1">允许转交</a-checkbox>
                <a-checkbox class="auth-item" v-model="flowNodeConfig.signable" :value="1">允许加签 / 减签</a-checkbox>
                <a-checkbox class="auth-item" v-model="flowNodeConfig.backable" :value="1">允许回退</a-checkbox>
                <a-checkbox class="auth-item" v-model="flowNodeConfig.backSubmitType" :value="1">驳回跳转提交</a-checkbox>
              </div>
            </div>
          </div>
        </div>

        <!-- 事件 -->
        <div class="item-content-auth" v-else-if="viewEditorType == 3">
          <div class="content-wrap">
            <div class="item-content">
              <div class="item-wrap auth-list">
                <a-checkbox-group direction="vertical" v-model="flowNodeConfig.events" class="auth-item">
                  <a-checkbox v-for="(item, index) in eventList" :key="index" :value="item.id">{{ item.name }}</a-checkbox>
                </a-checkbox-group>
              </div>
            </div>
          </div>
        </div>

        <!-- 参数 -->
        <div class="item-content-auth" v-else-if="viewEditorType == 4">
          <div class="content-wrap">
            <div class="item-content">
              <div class="item-table-header">
                <a-button size="small" type="primary" @click="handleAddParam">
                  <template #icon>
                    <icon-plus />
                  </template>
                  新增
                </a-button>
              </div>
              <a-table :columns="propertyColumns" :data="flowNodeConfig.extParams" :pagination="false">
                <template #index="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
                <template #name="{ rowIndex }">
                  <a-input v-model="flowNodeConfig.extParams[rowIndex].name" placeholder="请输入参数名" />
                </template>
                <template #value="{ rowIndex }">
                  <a-input v-model="flowNodeConfig.extParams[rowIndex].value" placeholder="请输入参数值" />
                </template>
                <template #operator="{ rowIndex }">
                  <a-button size="small" type="text" status="danger" title="删除" @click="handleDeleteParam(rowIndex)">
                    <template #icon>
                      <icon-delete />
                    </template>
                  </a-button>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { computed, ref, toRaw, watch } from "vue";
import { useFlowStore } from "@/store/index";
import OrganChooseBox from "../dialog/OrganChooseBox.vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import EditableText from "@/components/common/EditableText.vue";

let flowStore = useFlowStore();
let { showApproverDrawer, setApproverConfig } = flowStore;
let isApproverDrawerOpened = computed(() => flowStore.isApproverDrawerOpened);
let approverConfig0 = computed(() => flowStore.approverConfig0);
let visible = computed({
  get: () => isApproverDrawerOpened.value,
  set: () => close(),
});

let viewEditorType = ref(0); // 界面编辑类型    0:审批人，1:表单，2:操作，3:事件，4:参数
let _uid = ref(0);
let flowNodeConfig = ref({
  // type: 1,
  // approvalType: 0,
  multiInstanceApprovalType: 0,
  formConfig: {},
  extParams: [],
});

// 表单配置列表
const formUrlList = ref([]);

// 审批人规则
const ruleList = ref([]);

// 事件列表
const eventList = ref([]);

// 参数列
const propertyColumns = [
  {
    title: "序号",
    dataIndex: "index",
    fixed: "left",
    width: 60,
    slotName: "index",
  },
  {
    title: "参数名",
    dataIndex: "name",
    slotName: "name",
  },
  {
    title: "参数值",
    dataIndex: "value",
    slotName: "value",
  },
  {
    title: "操作",
    dataIndex: "operator",
    fixed: "right",
    width: 60,
    slotName: "operator",
  },
];
const handleAddParam = () => {
  if (!flowNodeConfig.value.extParams) {
    flowNodeConfig.value.extParams = [];
  }
  flowNodeConfig.value.extParams.push({
    name: "",
    value: "",
  });
};

const handleDeleteParam = (index) => {
  flowNodeConfig.value.extParams.splice(index, 1);
};

// 审批人选择【指定成员】
let showChooseAssignee4 = ref(false); // 是否显示指定成员对话框
let selectedAssignee4 = ref({}); // 当前选中的单个审批人设置
const onAssigneeClick = (item) => {
  selectedAssignee4.value = item;
  showChooseAssignee4.value = true;
};

// 审批人选择【指定部门负责人】
let showChooseAssignee2 = ref(false);
let selectedAssignee2 = ref({});
const onAssignee2Click = (item) => {
  selectedAssignee2.value = item;
  showChooseAssignee2.value = true;
};

watch(approverConfig0, (val) => {
  flowNodeConfig.value = val.value;

  if (!flowNodeConfig.value.formConfig) {
    flowNodeConfig.value.formConfig = {};
  }

  viewEditorType.value = 0;
  _uid = val.id;

  // 加载表单配置列表
  formUrlList.value = [
    { name: "表单1", url: "form1" },
    { name: "表单2", url: "form2" },
    { name: "表单3", url: "form3" },
  ];

  // 加载事件列表
  eventList.value = [
    { id: "a", name: "事件1" },
    { id: "b", name: "事件2" },
    { id: "c", name: "事件3" },
  ];
});

// 审批人类型切换时
const onAssigneeTypeChanged = (assignee) => {
  console.log("审批人类型切换时", assignee);
  assignee.assignees = [];
  let { assigneeType } = assignee;
  if ([11].includes(assigneeType)) {
    // 加载审批人规则
    ruleList.value = [{ id: "a", name: "自定义规则1" }, { id: "b", name: "自定义规则2" }];
  } else {
    delete assignee.ruleId;
  }
  if (assigneeType == 0) {
    flowNodeConfig.value.multiInstanceApprovalType = 0;
  } else {
    flowNodeConfig.value.multiInstanceApprovalType = 1;
  }
};

// 编辑节点名称
const onNodeNameChange = (name) => {
  flowNodeConfig.value.name = name;
  saveApprover(false);
};

const saveApprover = (leave = true) => {
  setApproverConfig({
    value: toRaw(flowNodeConfig.value),
    flag: true,
    id: _uid,
  });
  leave && close();
};

const close = () => {
  showApproverDrawer(false);
};
</script>

<style lang="less" scoped>
@import './ApproverDrawer.less';
</style>
