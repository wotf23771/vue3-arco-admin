import request from "@/utils/request";

export function queryConfig(parameter, query) {
  return request({
    url: "/system/config/queryConfig",
    method: "post",
    params: parameter,
    data: query,
  });
}

export function saveConfig(form) {
  return request({
    url: "/system/config/saveConfig",
    method: "post",
    data: form,
  });
}

export function getConfig(id) {
  return request({
    url: "/system/config/getConfig",
    method: "get",
    params: { id },
  });
}

export function updateConfig(id, form) {
  return request({
    url: "/system/config/updateConfig",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteConfig(id) {
  return request({
    url: "/system/config/deleteConfig",
    method: "post",
    params: { id },
  });
}

export function refreshConfigCache() {
  return request({
    url: "/system/config/refreshConfigCache",
    method: "post",
  });
}
