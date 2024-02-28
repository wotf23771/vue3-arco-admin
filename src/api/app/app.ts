import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface AppQuery {
    appName?: string; //应用名称
    appId?: string;   //应用ID
}

export interface AppForm {
  appName?: string; //应用名称
  appId?: string;   //应用ID
  version?: number;
  appSecret?: string;
  pcHost?: string;
  mobileHost?: string;
  procCallback?: string;
  taskCallback?: string;
  remark?: string;
}

export function queryApp(parameter: PageParam, query: AppQuery) {
  return request({
    url: "/app/queryApp",
    method: "post",
    params: parameter,
    data: query
  });
}

export function appList() {
  return request({
    url: "/app/list",
    method: "get",
  });
}

export function saveApp( from: AppForm) {
  return request({
    url: "/app/saveApp",
    method: "post",
    data: from
  });
}

export function updateApp(id:string , from: AppForm) {
  return request({
    url: "/app/updateApp",
    method: "post",
    params: {
      id: id
    },
    data: from
  });
}

export function deleteApp(id:string ) {
  console.log(111,id);
  return request({
    url: "/app/deleteApp",
    method: "post",
    params: {
      id: id
    }
  });
}

export function getAppById(id:string ) {
  return request({
    url: "/app/getAppById",
    method: "post",
    params: {
      id: id
    }
  });
}