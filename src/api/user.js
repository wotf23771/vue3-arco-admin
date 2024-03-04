import axios from "axios";
import request from "@/api/request";

export function login(data) {
  return axios.post("/api/user/login", data);
}

export function oauth2Login(code, state) {
  return request({
    url: "/login/oauth2/code/admin",
    method: "get",
    params: { code, state },
  });
}

export function logout() {
  return axios.post("/api/user/logout");
}

export function getUserInfo() {
  return request({
    url: "/profile/info",
    method: "get",
  });
}

export function getMenuList() {
  return axios.post("/api/user/menu");
}

export function getOAuth2AuthorizeUrl(redirectUri) {
  return request({
    url: "/auth/url",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    params: { redirectUri },
  });
}
