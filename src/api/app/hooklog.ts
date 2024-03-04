import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface AppCallbackLogQuery {
    appId?: string;   //应用ID
    procInstName?: string;//流程实例名称
    taskName?: string; //任务名称
    callbackType?: string; //回调类型
}


export function queryAppCallbackLog(parameter: PageParam, query: AppCallbackLogQuery) {
  return request({
    url: "/procLog/queryAppCallbackLog",
    method: "post",
    params: parameter,
    data: query
  });
}

export function getAppCallbackLogById(id:string ) {
  return request({
    url: "/procLog/getAppCallbackLogById",
    method: "post",
    params: {
      id: id
    }
  });
}