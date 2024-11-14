export function getDictOptionLabel(options: DictOption[], value: string | number) {
  if (options && options.length > 0) {
    let ops = options.find(op => op.value == value);
    return ops ? ops.label : "";
  } else {
    return "";
  }
}
