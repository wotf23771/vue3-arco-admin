import request from "@/api/request";
import { PageParam } from "@/types/global";

export interface UserTodoQuery {
    appId?: string; //应用id
    procInstName?: string; //流程实例名称
    taskName?: string;   // 任务名称
    receiverName?: string;//接收人姓名
    senderName?: string; // 发送人姓名
   
}
export interface UserToReadQuery {
  appId?: string; //应用id
  procInstName?: string; //流程实例名称
  taskName?: string;   // 任务名称
  receiverName?: string;//接收人姓名
  senderName?: string; // 发送人姓名
 
}

export interface UserHavedoQuery {
  appId?: string; //应用id
  procInstName?: string; //流程实例名称
  taskName?: string;   // 任务名称
  receiverName?: string;//接收人姓名
  senderName?: string; // 发送人姓名
 
}

export interface UserHaveReadQuery {
  appId?: string; //应用id
  procInstName?: string; //流程实例名称
  taskName?: string;   // 任务名称
  receiverName?: string;//接收人姓名
  senderName?: string; // 发送人姓名
 
}

export interface UserAttentionQuery {
  appId?: string; //应用id
  procInstName?: string; //流程实例名称
 
}


export function pageQueryTodo(parameter: PageParam, query: UserTodoQuery) {
  return request({
    url: "/userTask/pageQueryTodo",
    method: "post",
    params: parameter,
    data: query
  });
}

export function pageQueryToRead(parameter: PageParam, query: UserHavedoQuery) {
  return request({
    url: "/userTask/pageQueryToRead",
    method: "post",
    params: parameter,
    data: query
  });
}


export function pageQueryHavedo(parameter: PageParam, query: UserToReadQuery) {
  return request({
    url: "/userTask/pageQueryHavedo",
    method: "post",
    params: parameter,
    data: query
  });
}


export function pageQueryHaveRead(parameter: PageParam, query: UserHaveReadQuery) {
  return request({
    url: "/userTask/pageQueryHaveRead",
    method: "post",
    params: parameter,
    data: query
  });
}


export function pageQueryAttention(parameter: PageParam, query: UserAttentionQuery) {
  return request({
    url: "/userTask/pageQueryAttention",
    method: "post",
    params: parameter,
    data: query
  });
}
