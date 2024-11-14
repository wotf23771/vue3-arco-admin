import request from "@/utils/request";

export function listMenu() {
  return request({
    url: "/system/menu/list",
    method: "get",
  });
}

export function saveMenu(parentId, form) {
  return request({
    url: "/system/menu/saveMenu",
    method: "post",
    params: { parentId },
    data: form,
  });
}

export function getMenu(id) {
  return request({
    url: "/system/menu/getMenu",
    method: "get",
    params: { id },
  });
}

export function updateMenu(id, form) {
  return request({
    url: "/system/menu/updateMenu",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteMenu(id) {
  return request({
    url: "/system/menu/deleteMenu",
    method: "post",
    params: { id },
  });
}

export function listMenuPerm(menuId) {
  return request({
    url: "/system/menu/listMenuPerm",
    method: "get",
    params: { menuId },
  });
}

export function saveMenuPerm(menuId, form) {
  return request({
    url: "/system/menu/saveMenuPerm",
    method: "post",
    params: { menuId },
    data: form,
  });
}

export function getMenuPerm(id) {
  return request({
    url: "/system/menu/getMenuPerm",
    method: "get",
    params: { id },
  });
}

export function updateMenuPerm(id, form) {
  return request({
    url: "/system/menu/updateMenuPerm",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteMenuPerm(id) {
  return request({
    url: "/system/menu/deleteMenuPerm",
    method: "post",
    params: { id },
  });
}

/**
 * 获得全部资源，对于已经授权的资源会进行标记 selected=true
 * @returns {*}
 */
export function listRes(menuPermId) {
  return request({
    url: "/system/menu/listRes",
    method: "get",
    params: { menuPermId },
  });
}

export function saveMenuPermRes(menuPermId, authorityList) {
  return request({
    url: "/system/menu/saveMenuPermRes",
    method: "post",
    params: { menuPermId },
    data: authorityList,
  });
}
