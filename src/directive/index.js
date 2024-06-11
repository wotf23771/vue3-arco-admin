import print from "vue3-print-nb";

export default {
  install(Vue) {
    Vue.directive("print", print);
  },
};