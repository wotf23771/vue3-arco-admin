import request from "@/utils/request.js";
import { ConfigForm, ConfigItem, ConfigQuery } from "../model";

export function queryConfig(parameter: PageParam, query: ConfigQuery): Promise<WebResult<ConfigItem[]>> {
  return request({
    url: "/system/config/queryConfig",
    method: "post",
    params: parameter,
    data: query,
  });
}

export function saveConfig(form: ConfigForm): Promise<WebResult<void>> {
  return request({
    url: "/system/config/saveConfig",
    method: "post",
    data: form,
  });
}

export function getConfig(id: string): Promise<WebResult<ConfigForm>> {
  return request({
    url: "/system/config/getConfig",
    method: "get",
    params: { id },
  });
}

export function updateConfig(id: string, form: ConfigForm): Promise<WebResult<void>> {
  return request({
    url: "/system/config/updateConfig",
    method: "post",
    params: { id },
    data: form,
  });
}

export function deleteConfig(id: string): Promise<WebResult<void>> {
  return request({
    url: "/system/config/deleteConfig",
    method: "post",
    params: { id },
  });
}

export function refreshConfigCache(): Promise<WebResult<void>> {
  return request({
    url: "/system/config/refreshConfigCache",
    method: "post",
  });
}
