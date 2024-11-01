import request from "@/utils/request";

export interface LoginResp {
  access_token: string,
  private_key?: string,
  secret_key?: string
}

export function login(username: string, password: string): Promise<WebResult<LoginResp>> {
  return request({
    url: "/security/login",
    method: "post",
    params: { username, password },
  });
}

export function oauth2Login(code: string, state: string): Promise<WebResult<LoginResp>> {
  return request({
    url: "/login/oauth2/code/admin",
    method: "get",
    params: { code, state },
  });
}

export function logout() {
  return request({
    url: "/security/auth/logout",
    method: "post",
  });
}

export function getUserInfo() {
  return request({
    url: "/security/profile/info",
    method: "get",
  });
}

export function getUserMenu() {
  return request({
    url: "/security/profile/menu",
    method: "get",
  });
}

export function getOAuth2AuthorizeUrl(redirectUri: string) {
  return request({
    url: "/security/auth/url",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    params: { redirectUri },
  });
}
