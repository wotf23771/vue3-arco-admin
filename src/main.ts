import globalComponents from "@/components";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import { createApp } from "vue";
import App from "./App.vue";
import "virtual:svg-icons-register";

// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import "@/assets/style/global.less";
import router from "./router";
import store from "./store";
import "@/theme/default/index.less";

import.meta.glob("/apps/**/main.ts", { eager: true });

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(globalComponents);

app.config.errorHandler = (err, vm, info) => {

};

app.mount("#app");
