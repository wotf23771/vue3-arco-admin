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
              配置表单
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
              配置事件
            </div>
          </div>
        </div>

        <!-- 参数 -->
        <div class="item-content-auth" v-else-if="viewEditorType == 4">
          <div class="content-wrap">
            <div class="item-content">
              配置参数
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref, toRaw, watch } from "vue";
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
  // flowNodeNoAuditorType: 0,
  // flowNodeSelfAuditorType: 0,
  // assignees: [
  // {
  //   id: Snowflake.generate(),
  //   assigneeType: 0,
  //   layerType: 0,
  // },
  // ],
});

// 审批人规则
const ruleList = ref([]);

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
  viewEditorType.value = 0;
  _uid = val.id;
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

onBeforeMount(() => {
});
onMounted(() => {
});
</script>

<style lang="less">
.approver-drawer__content {
  user-select: none;

  .approval-editor-tab-wrapper {
    margin-top: 24px;

    .item-content-editor,
    .item-content-auth {
      margin-top: 8px;

      .approver-list {
        .approver-wrapper {
          border: 1px solid #e4e5e7;
          border-radius: 6px;
          overflow: hidden;

          + .approver-wrapper {
            margin-top: 6px;
          }

          .header {
            padding: 0 16px;
            background: #f5f6f7;
            height: 36px;
            line-height: 36px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
              color: #1f2329;
              font-weight: 600;
            }

            .arco-icon {
              cursor: pointer;

              &:hover {
                color: #3370ff;
              }
            }
          }

          .sub-content {
            padding: 0 16px 10px;

            .sub-content-top-line {
              border-top: 1px solid #dee0e3;
            }

            p {
              padding-top: 10px;
              color: #1f2329;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 8px;

              span {
                color: #8f959e;
                font-weight: 400;
                font-size: 13px;
              }
            }

            .arco-form-item {
              margin-bottom: 0;
            }

            .assignee-box {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .assignee-list {
                flex: 1;
                margin-left: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 4px;

                .arco-tag {
                  height: 28px;
                }
              }
            }
          }

          .radio-group {
            padding: 10px 16px;
            width: 100%;

            .arco-radio {
              margin-right: 2px;
            }
          }
        }
      }

      .item-wrap {
        + .item-wrap {
          margin-top: 24px;
        }
      }

      .auth-list {
        display: flex;
        flex-direction: column;

        .auth-item {
          margin-top: 10px;
        }
      }

    }
  }

  .arco-radio-group-button {
    width: 100%;

    .arco-radio-button {
      flex: 1;
      text-align: center;
    }
  }

  .item-key-wrapper {
    .item-key {
      color: #1f2329;
      font-weight: 600;
    }
  }

  .item-content {
    margin-top: 8px;
  }
}

</style>
