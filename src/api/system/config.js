import request from "@/api/request";

export function queryConfig(parameter, query) {
  return request({
    url: "/config/queryConfig",
    method: "post",
    params: parameter,
    data: query,
  });
}

export function saveConfig(form) {
  return request({
    url: "/config/saveConfig",
    method: "post",
    data: form,
  });
}
