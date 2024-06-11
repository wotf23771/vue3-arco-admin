import request from "@/utils/request";

export function listDictItem(type) {
  return request({
    url: "/system/dict/listDictItem",
    method: "get",
    params: { type },
  });
}

export function listDictItems(types) {
  return request({
    url: "/system/dict/listDictItems",
    method: "get",
    params: { types:types.join() },
  });
}

