const formatModules = (_modules, result) => {
    Object.keys(_modules).forEach((key) => {
        const defaultModule = _modules[key].default;
        if (!defaultModule) return;
        const moduleList = Array.isArray(defaultModule)
            ? [...defaultModule]
            : [defaultModule];
        result.push(...moduleList);
    });
    return result;
}

const modules = import.meta.glob('./modules/*.js', { eager: true });
export const appRoutes = formatModules(modules, []);
