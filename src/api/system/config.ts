import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface ConfigQuery {
  name?: string;
}

export function queryConfig(parameter: PageParam, query: ConfigQuery) {
  return request({
    url: "/config/queryConfig",
    method: "post",
    params: parameter,
    data: query
  });
}
