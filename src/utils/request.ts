import axios from "axios";
import { getToken } from "@/utils/auth";
import router from "@/router";
import { Notification } from "@arco-design/web-vue";
import { aesDecode } from "@/utils/aes";

const errorHandler = (error) => {
  console.log("error", error);
  let errorCode = error.code;
  if (errorCode == "ERR_NETWORK") {
    Notification.error({
      title: "错误",
      content: "网络链接错误",
      duration: 10000,
      closable: true,
    });
    return Promise.reject(error);
  }
  let status = error.response.status;
  if (error.response) {
    const { code, message } = error.response.data;

    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN)
    if (status === 403) {
      Notification.error({
        title: "403",
        content: message || "未授权",
        duration: 10000,
        closable: true,
      });
    } else if (status === 404) {
      Notification.error({
        title: "404",
        content: "请求的页面（资源）不存在，" + error.request.responseURL,
        duration: 10000,
        closable: true,
      });
    } else if (status === 401) {
      router.replace("/login");
    } else if (status === 500) {
      Notification.error({
        title: "500",
        content: message || "服务错误",
        duration: 10000,
        closable: true,
      });
    }
    return Promise.reject(error);
  }
};

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 超时时间，10s
  withCredentials: true,
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
});
request.interceptors.request.use(config => {
      // 是否需要设置 token
      const headers = config.headers || { isToken: false };
      const isToken = headers.isToken === false;
      const token = getToken();
      if (token && !isToken) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return errorHandler(error);
    },
);
// add response interceptors
request.interceptors.response.use((response) => {
      if (response.config.responseType === "blob") {
        return response;
      } else {
        if (response.headers["x-encrypt-body"] == 1) {
          let data = aesDecode(response.data);
          return JSON.parse(data);
        }
        return Object.assign({ success: false }, response.data);
      }
    },
    (error) => {
      return errorHandler(error);
    },
);

export default request;
