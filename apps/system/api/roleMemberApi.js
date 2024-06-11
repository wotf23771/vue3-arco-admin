import request from "@/utils/request";

export function queryRoleMember(roleId, parameter, query) {
  return request({
    url: "/system/roleMember/queryRoleMember",
    method: "post",
    params: { roleId, ...parameter },
    data: query,
  });
}

export function saveRoleUnion(roleId, unionIds) {
  return request({
    url: "/system/roleMember/saveRoleUnion",
    method: "post",
    params: { roleId, unionIds: unionIds.join() },
  });
}

export function saveRoleUser(roleId, userIds) {
  return request({
    url: "/system/roleMember/saveRoleUser",
    method: "post",
    params: { roleId, userIds: userIds.join() },
  });
}

export function deleteRoleMember(id) {
  return request({
    url: "/system/roleMember/deleteRoleMember",
    method: "post",
    params: { id },
  });
}
