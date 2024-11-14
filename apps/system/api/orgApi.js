import request from "@/utils/request";

export function listOrgByParentId(parentId) {
  return request({
    url: "/system/org/listOrgByParentId",
    method: "get",
    params: { parentId },
  });
}

export function queryOrgChildren(parentId, page, query) {
  return request({
    url: "/system/org/queryOrgChildren",
    method: "post",
    params: { parentId, ...page },
    data: query,
  });
}

export function saveOrg(parentId, form) {
  return request({
    url: "/system/org/saveOrg",
    method: "post",
    params: { parentId },
    data: form,
  });
}

export function getOrg(id) {
  return request({
    url: "/system/org/getOrg",
    method: "get",
    params: { id },
  });
}

export function updateOrg(id, form) {
  return request({
    url: "/system/org/updateOrg",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteOrg(id) {
  return request({
    url: "/system/org/deleteOrg",
    method: "post",
    params: { id },
  });
}
