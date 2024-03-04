import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import globalComponents from "./components/index";
import router from "./router";
import store from "./store";
import directive from "./directive";
import App from "./App.vue";
// Styles are imported via arco-plugin. See build/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 build/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import "@/assets/style/global.less";
// 拖拽滚动组件
import Vue3Dragscroll from "vue3-dragscroll";

const app = createApp(App);

app.use(Vue3Dragscroll);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(globalComponents);
app.use(directive);

app.mount("#app");

