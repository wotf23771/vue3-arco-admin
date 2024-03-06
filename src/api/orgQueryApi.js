import request from "@/api/request";

export function loadUserTreeChildNode(parentId) {
  return request({
    url: "/orgQuery/org/asyncTree/userTree",
    method: "get",
    params: { parentId },
  });
}

export function loadDeptTreeChildNode(parentId) {
  return request({
    url: "/orgQuery/org/asyncTree/deptTree",
    method: "get",
    params: { parentId },
  });
}

export function loadUnitTreeChildNode(parentId) {
  return request({
    url: "/orgQuery/org/asyncTree/unitTree",
    method: "get",
    params: { parentId },
  });
}
