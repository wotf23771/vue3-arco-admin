import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface ProcInstQuery {
    appId?: string; //应用id
    name?: string; //流程实例名称
    defKey?: string;   // 流程定义key
    defName?: string;//流程定义名称
    formCode?: string; //表单code
    procInstStatus?: string;//流程实例状态
}



export function pageQueryProcInst(parameter: PageParam, query: ProcInstQuery) {
  return request({
    url: "/procInst/pageQueryProcInst",
    method: "post",
    params: parameter,
    data: query
  });
}
