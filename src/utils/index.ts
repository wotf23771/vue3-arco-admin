type TargetContext = "_self" | "_parent" | "_blank" | "_top";

export const openWindow = (url: string, opts?: { target?: TargetContext; [key: string]: any }) => {
  const { target = "_blank", ...others } = opts || {};
  window.open(
      url,
      target,
      Object.entries(others)
          .reduce((preValue: string[], curValue) => {
            const [key, value] = curValue;
            return [...preValue, `${key}=${value}`];
          }, [])
          .join(","),
  );
};

export const regexUrl = new RegExp(
    "^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
    "i",
);

export function resolveDefaultModules(_modules: any): any {
  let result = [];
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

