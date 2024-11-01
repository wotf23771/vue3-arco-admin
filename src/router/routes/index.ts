import { resolveDefaultModules } from "@/utils";

const modules = import.meta.glob("./modules/*.ts", { eager: true });
export const appRoutes = resolveDefaultModules(modules);
