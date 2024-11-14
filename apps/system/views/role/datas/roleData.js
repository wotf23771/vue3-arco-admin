export const dataScopeTypeOptions = [
  { label: "全部", value: 0 },
  { label: "本级及下级工会", value: 1 },
  { label: "本级工会", value: 2 },
  { label: "本人", value: 3 },
  { label: "指定工会", value: 4 },
];

export function getDataScopeTypeName(value) {
  return dataScopeTypeOptions.find((item) => item.value === value).label;
}