import request from "@/api/request";

export function queryUser(parameter, query) {
  return request({
    url: "/user/queryUser",
    method: "post",
    params: parameter,
    data: query,
  });
}

export function saveUser(form) {
  return request({
    url: "/user/saveUser ",
    method: "post",
    data: form,
  });
}

export function getUser(id) {
  return request({
    url: "/user/getUser",
    method: "get",
    params: { id },
  });
}

export function updateUser(id, form) {
  return request({
    url: "/user/updateUser",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteUser(id) {
  return request({
    url: "/user/deleteUser",
    method: "post",
    params: { id },
  });
}
