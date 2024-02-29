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

export function deleteConfig(id) {
  return request({
    url: "/config/deleteConfig",
    method: "post",
    params: { id },
  });
}

/**
 * 获得配置固定值
 * @param configId 配置ID
 * @param scope 配置范围，全局范围为 DEFAULT，其他或单位ID或用户ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getConfigValue(configId, scope) {
  return request({
    url: "/config/getConfigValue",
    method: "get",
    params: { configId, scope },
  });
}

export function updateConfigValue(configId, scope, value) {
  return request({
    url: "/config/updateConfigValue",
    method: "post",
    params: { configId, scope, value },
  });
}
