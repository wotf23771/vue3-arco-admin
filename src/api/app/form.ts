import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface FormQuery {
    name?: string; // 表单名称
    code?: string;   //表单编码
    appId?: string; //应用ID
}

export interface FormForm {
  appName?: string; //应用名称
  appId?: string;   //应用ID
  version?: number;  //版本号
  code?: string;  //表单编码
  name?: string;  //表单名称
  sn?: number;  //表单序列号
 
}

export function queryForm(parameter: PageParam, query: FormQuery) {
  return request({
    url: "/form/queryForm",
    method: "post",
    params: parameter,
    data: query
  });
}

export function saveForm( form: FormForm) {
  return request({
    url: "/form/saveForm",
    method: "post",
    data: form
  });
}

export function getForm(id :string) {
  return request({
    url: "/form/getForm",
    method: "get",
    params: { id },
  });
}

export function updateForm(id:string, form : FormForm) {
  return request({
    url: "/form/updateForm",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteForm(id :string) {
  return request({
    url: "/form/deleteForm",
    method: "post",
    params: { id },
  });
}