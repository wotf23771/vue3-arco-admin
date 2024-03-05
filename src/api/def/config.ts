import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface ProcDefQuery {
    appId?: string; //应用id
    name?: string; //流程定义名称
    procDefKey?: string;   // 流程定义key
}

export interface ProcDefForm {
  procDefKey?: string; // 流程定义key
  name?: string;   // 流程定义名称
  appId?: string; // 应用id
  appName?: string; // 应用名称
  formId?: string; // 表单id
  formName?: string; // 表单名称
  formCode?: string; // 表单编码
  
  version?: number;  //版本号
}

export interface ProcDesignForm {
  process?: string;  //版本号
}

export function queryProcDef(parameter: PageParam, query: ProcDefQuery) {
  return request({
    url: "/procDef/queryProcDef",
    method: "post",
    params: parameter,
    data: query
  });
}
export function saveProcDef( form: ProcDefForm) {
  return request({
    url: "/procDef/saveProcDef",
    method: "post",
    data: form
  });
}

export function updateProcDef(id: string, form: ProcDesignForm) {
  return request({
    url: "/procDef/updateProcDef",
    method: "post",
    params: {
      id: id
    },
    data: form
  });
}

export function getProcDef(id :string) {
  return request({
    url: "/procDef/getProcDef",
    method: "post",
    params: { id },
  });
}

export function deleteProcDef(procDefKey :string) {
  return request({
    url: "/procDef/deleteProcDef",
    method: "post",
    params: { procDefKey },
  });
}

// 发起流程
export function testStart(key :string) {
  return request({
    url: "/procInst/testStart",
    method: "get",
    params: { key },
  });
}

// 查看流程图
export function getProcDefImage(key :string) {
  return request({
    url: "/procInst/getProcDefImage",
    method: "get",
    params: { key },
  });
}

export function getXMLDefinition(key :string) {
  return request({
    url: "/procDef/getXMLDefinition",
    method: "get",
    params: { key },
  });
}
