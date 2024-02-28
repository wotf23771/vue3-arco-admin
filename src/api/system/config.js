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

export function getConfig(id) {
  return request({
    url: "/config/getConfig",
    method: "get",
    params: { id },
  });
}

export function updateConfig(id, form) {
  return request({
    url: "/config/updateConfig",
    method: "post",
    params: { id },
    data: form,
  });
}
