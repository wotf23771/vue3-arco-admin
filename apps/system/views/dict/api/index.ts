import request from "@/utils/request.js";
import { TypeForm, TypeItem, TypeQuery, ValueForm, ValueItem } from "../model";

export function queryType(parameter: PageParam, query: TypeQuery): Promise<WebResult<TypeItem[]>> {
  return request({
    url: "/system/dict/queryType",
    method: "post",
    params: parameter,
    data: query,
  });
}

export function saveType(form: TypeForm): Promise<WebResult<void>> {
  return request({
    url: "/system/dict/saveType",
    method: "post",
    data: form,
  });
}

export function getType(id: string): Promise<WebResult<TypeForm>> {
  return request({
    url: "/system/dict/getType",
    method: "get",
    params: { id },
  });
}

export function updateType(id: string, form: TypeForm): Promise<WebResult<void>> {
  return request({
    url: "/system/dict/updateType",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteType(id: string): Promise<WebResult<void>> {
  return request({
    url: "/system/dict/deleteType",
    method: "post",
    params: { id },
  });
}

export function refreshCache(type: string): Promise<WebResult<void>> {
  return request({
    url: "/system/dict/refreshCache",
    method: "post",
    params: { type },
  });
}

export function listValue(typeId: string): Promise<WebResult<ValueItem[]>> {
  return request({
    url: "/system/dict/listValue",
    method: "get",
    params: { typeId },
  });
}

export function saveValue(typeId: string, form: ValueForm): Promise<WebResult<void>> {
  return request({
    url: "/system/dict/saveValue",
    method: "post",
    params: { typeId },
    data: form,
  });
}

export function getValue(id: string): Promise<WebResult<ValueForm>> {
  return request({
    url: "/system/dict/getValue",
    method: "get",
    params: { id },
  });
}

export function updateValue(id: string, form: ValueForm): Promise<WebResult<void>> {
  return request({
    url: "/system/dict/updateValue",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteValue(id: string): Promise<WebResult<void>> {
  return request({
    url: "/system/dict/deleteValue",
    method: "post",
    params: { id },
  });
}
