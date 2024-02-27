import { appExternalRoutes, appRoutes } from "../routes";

const mixinRoutes = [...appRoutes, ...appExternalRoutes];
console.log("t1", mixinRoutes);
const appClientMenus = mixinRoutes.map((el) => {
  const { name, path, meta, redirect, children } = el;
  return {
    name,
    path,
    meta,
    redirect,
    children
  };
});
export default appClientMenus;
