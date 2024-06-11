import request from "@/utils/request";

export function queryOrgUser(orgId, page, query) {
  return request({
    url: "/system/orgUser/queryOrgUser",
    method: "post",
    params: { orgId, ...page },
    data: query,
  });
}

export function saveMainOrgUser(orgId, form) {
  return request({
    url: "/system/orgUser/saveMainOrgUser",
    method: "post",
    params: { orgId },
    data: form,
  });
}

export function getOrgUser(orgId, userId) {
  return request({
    url: "/system/orgUser/getOrgUser",
    method: "get",
    params: { orgId, userId },
  });
}

export function updateOrgUser(orgId, userId, form) {
  return request({
    url: "/system/orgUser/updateOrgUser",
    method: "post",
    params: { orgId, userId },
    data: form,
  });
}

export function deleteOrgUser(orgId, userId) {
  return request({
    url: "/system/orgUser/deleteOrgUser",
    method: "post",
    params: { orgId, userId },
  });
}

export function saveOrgUser(orgId, userId) {
  return request({
    url: "/system/orgUser/saveOrgUser",
    method: "post",
    params: { orgId, userId },
  });
}
