import request from "@/utils/request";

export function queryType(parameter, query) {
  return request({
    url: "/system/dict/queryType",
    method: "post",
    params: parameter,
    data: query,
  });
}

export function saveType(form) {
  return request({
    url: "/system/dict/saveType",
    method: "post",
    data: form,
  });
}

export function getType(id) {
  return request({
    url: "/system/dict/getType",
    method: "get",
    params: { id },
  });
}

export function updateType(id, form) {
  return request({
    url: "/system/dict/updateType",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteType(id) {
  return request({
    url: "/system/dict/deleteType",
    method: "post",
    params: { id },
  });
}

export function refreshCache(type) {
  return request({
    url: "/system/dict/refreshCache",
    method: "post",
    params: { type },
  });
}

export function listValue(typeId) {
  return request({
    url: "/system/dict/listValue",
    method: "get",
    params: { typeId },
  });
}

export function saveValue(typeId, form) {
  return request({
    url: "/system/dict/saveValue",
    method: "post",
    params: { typeId },
    data: form,
  });
}

export function getValue(id) {
  return request({
    url: "/system/dict/getValue",
    method: "get",
    params: { id },
  });
}

export function updateValue(id, form) {
  return request({
    url: "/system/dict/updateValue",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteValue(id) {
  return request({
    url: "/system/dict/deleteValue",
    method: "post",
    params: { id },
  });
}
