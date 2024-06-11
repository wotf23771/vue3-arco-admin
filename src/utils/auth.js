const TOKEN_KEY = "access_token";
const PATH_KEY = "LastPath";

const isLogin = () => {
  return !!sessionStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};
const saveLastPath = (path) => {
  sessionStorage.setItem(PATH_KEY, path);
};

const getLastPath = () => {
  return sessionStorage.getItem(PATH_KEY);
};
export { isLogin, getToken, setToken, clearToken };
