import axios, { AxiosError } from "axios";
import { getToken } from "@/utils/auth";

const errorHandler = (error: AxiosError) => {
  if (error.response) {
    const data = error.response.data;
    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 404) {
      // notification.error({
      //   message: "请求的资源不存在",
      //   description: error.build.url
      // });
      return Promise.reject(error);
    } else if (error.response.status === 403) {
      // notification.error({
      //   message: "未授权",
      //   description: data.message
      // });
      return Promise.reject(error);
    } else if (error.response.status === 401) {
      // Modal.warning({
      //   content: data.message,
      //   okText: "确定",
      //   onOk() {
      //     getOAuth2AuthorizeUrl(process.env.VUE_APP_OAUTH2_REDIRECT_URI).then(res => {
      //       sessionStorage.remove(ACCESS_TOKEN);
      //       location.replace(res.data);
      //     });
      //   }
      // });
    } else {
      return Promise.reject(error);
    }
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
    const isToken = (config.headers || {}).isToken === false;
    const token = getToken();
    if (token && !isToken) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return errorHandler(error);
  },
);
// add response interceptors
request.interceptors.response.use((response) => {
    if (response.config.responseType === "blob") {
      return response;
    } else {
      return response.data;
    }
  },
  (error: AxiosError) => {
    return errorHandler(error);
  },
);

export default request;
