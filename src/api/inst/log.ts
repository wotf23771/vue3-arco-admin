import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface ReassignRecordQuery {
    procInstName?: string; //流程实例名称
    taskName?: string;   // 任务名称
}
export interface SignRecordQuery {
    procInstName?: string; //流程实例名称
    taskName?: string;   // 任务名称
}


export function queryReassignRecord(parameter: PageParam, query: ReassignRecordQuery) {
  return request({
    url: "/procLog/queryReassignRecord",
    method: "post",
    params: parameter,
    data: query
  });
}

export function querySignRecord(parameter: PageParam, query: SignRecordQuery) {
  return request({
    url: "/procLog/querySignRecord",
    method: "post",
    params: parameter,
    data: query
  });
}


