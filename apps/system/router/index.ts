import { resolveDefaultModules } from "@/utils";

const modules = import.meta.glob("./modules/*.ts", { eager: true });
const routes = resolveDefaultModules(modules);

export default routes;
