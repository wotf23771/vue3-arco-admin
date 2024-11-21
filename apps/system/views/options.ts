export const isEnabledOptions: DictOption[] = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 },
];

export const isLockedOptions: DictOption[] = [
  { label: "解锁", value: 0 },
  { label: "锁定", value: 1 },
];

export const logicOptions: DictOption[] = [
  { label: "是", value: 1 },
  { label: "否", value: 0 },
];

export const genderOptions: DictOption[] = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
  { label: "不确定", value: "9" },
];

export const dataScopeOptions: DictOption[] = [
  { label: "全部", value: "0" },
  { label: "本单位", value: "1" },
  { label: "本部门", value: "2" },
  { label: "本岗位", value: "3" },
  { label: "本人", value: "4" },
];

export const jobStatusOptions: DictOption[] = [
  { label: "暂停", value: 0 },
  { label: "正常", value: 1 },
  { label: "执行中", value: 2 },
  { label: "完成", value: 3 },
];

export const missPolicyOptions: DictOption[] = [
  { label: "忽略", value: 0 },
  { label: "触发一次", value: 1 },
];

export const noticeTypeOptions: DictOption[] = [
  { value: "approve_result", label: "审核结果通知" },
  { value: "approve_timeout", label: "审核超时提醒" },
  { value: "report_result", label: "上报结果通知" },
];
