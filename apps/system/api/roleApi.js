import request from "@/utils/request";

export function queryRole(parameter, query) {
  return request({
    url: "/system/role/queryRole",
    method: "post",
    params: parameter,
    data: query,
  });
}

export function saveRole(form) {
  return request({
    url: "/system/role/saveRole",
    method: "post",
    data: form,
  });
}

export function getRole(id) {
  return request({
    url: "/system/role/getRole",
    method: "get",
    params: { id },
  });
}

export function updateRole(id, form) {
  return request({
    url: "/system/role/updateRole",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteRole(id) {
  return request({
    url: "/system/role/deleteRole",
    method: "post",
    params: { id },
  });
}

export function loadUserUnionTreeData(module) {
  return request({
    url: "/system/role/loadUserUnionTreeData",
    method: "get",
    params: { module },
  });
}

export function loadUnionMemberList(unionId, page) {
  return request({
    url: "/system/role/loadUnionMemberList",
    method: "get",
    params: { unionId, ...page },
  });
}

export function loadRoleMenuTree(roleId) {
  return request({
    url: "/system/role/loadRoleMenuTree",
    method: "get",
    params: { roleId },
  });
}

export function saveRoleMenuPerm(roleId, permList) {
  return request({
    url: "/system/role/saveRoleMenuPerm",
    method: "post",
    params: { roleId },
    data: permList,
  });
}

