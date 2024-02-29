import request from "@/api/request";
import { PageParam } from "@/types/global";

// 业务表单
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

// 表单属性

export interface FormPropertyQuery {
  formId?: string; // 表单id
  code?: string;   //属性编码
  name?: string; //属性名称
  dataType?: string; // 数据类型
}

export interface FormPropertyForm {
  formId?: string; //表单id
  code?: string;   //属性编码
  name?: string;  //属性名称
  dataType?: string; // 数据类型
  version?: number;  //版本号
}

export function queryFormProperty(parameter: PageParam, query: FormPropertyQuery) {
return request({
  url: "/form/queryFormProperty",
  method: "post",
  params: parameter,
  data: query
});
}
export function listFormProperty(formId :string) {
  return request({
    url: "/form/listFormProperty",
    method: "get",
    params: { formId },
  });
  }

export function saveFormProperty( form: FormPropertyForm) {
return request({
  url: "/form/saveFormProperty",
  method: "post",
  data: form
});
}



export function getFormProperty(id :string) {
return request({
  url: "/form/getFormProperty",
  method: "get",
  params: { id },
});
}

export function updateFormProperty(id:string, form : FormPropertyForm) {
return request({
  url: "/form/updateFormProperty",
  method: "post",
  params: { id },
  data: form,
});
}

export function deleteFormProperty(id :string) {
return request({
  url: "/form/deleteFormProperty",
  method: "post",
  params: { id },
});
}

// 表单页面
export interface FormPageQuery {
  formId?: string; // 表单id
  name?: string; //表单名称
}

export interface FormPageForm {
  formId?: string; //表单id
  name?: string;  //页面名称
  url?: string; // 页面地址
  sn?: number;  //表单序列号
  version?: number;  //版本号
}

export function queryFormPage(parameter: PageParam, query: FormPageQuery) {
return request({
  url: "/form/queryFormPage",
  method: "post",
  params: parameter,
  data: query
});
}
export function listFormPage(formId :string) {
  return request({
    url: "/form/listFormPage",
    method: "get",
    params: { formId },
  });
  }

export function saveFormPage( form: FormPageForm) {
return request({
  url: "/form/saveFormPage",
  method: "post",
  data: form
});
}



export function getFormPage(id :string) {
return request({
  url: "/form/getFormPage",
  method: "get",
  params: { id },
});
}

export function updateFormPage(id:string, form : FormPageForm) {
return request({
  url: "/form/updateFormPage",
  method: "post",
  params: { id },
  data: form,
});
}

export function deleteFormPage(id :string) {
return request({
  url: "/form/deleteFormPage",
  method: "post",
  params: { id },
});
}
