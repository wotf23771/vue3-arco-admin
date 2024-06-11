import request from "@/utils/request";

export function login(username, password) {
  return request({
    url: "/login",
    method: "post",
    params: { username, password },
  });
}

export function oauth2Login(code, state) {
  // return request({
  //     url: "/login/oauth2/code/admin",
  //     method: "get",
  //     params: { code, state },
  // });
  return new Promise((resolve, reject) => {
    resolve({
      access_token: "1234567890",
    });
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
