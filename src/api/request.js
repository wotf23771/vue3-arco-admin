import axios from "axios";
import { getToken } from "@/utils/auth";
import { Modal } from "@arco-design/web-vue";
import { getOAuth2AuthorizeUrl } from "@/api/user";

const errorHandler = (error) => {
  console.log("error", error);
  if (error.response) {
    const { code, message } = error.response.data;

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
      if (code == 40101) {
        Modal.open({
          title: "登录失败",
          closable: false,
          content: message,
          hideCancel: true,
          okText: "重新登录",
          onOk: () => {
            getOAuth2AuthorizeUrl(import.meta.env.VITE_APP_OAUTH2_REDIRECT_URI).then(res => {
              location.replace(res.data);
            });
          },
        });
      }
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
  (error) => {
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
  (error) => {
    return errorHandler(error);
  },
);

export default request;
