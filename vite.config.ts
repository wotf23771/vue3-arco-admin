import { resolve } from "path";
import { ConfigEnv, loadEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import configArcoStyleImportPlugin from "./build/plugin/arcoStyleImport";
import configCompressPlugin from "./build/plugin/compress";
import configArcoResolverPlugin from "./build/plugin/arcoResolver";
import { ViteEjsPlugin } from "vite-plugin-ejs";

const CWD = process.cwd();
export default ({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === "production";
  const { VITE_BASE_PATH, VITE_APP_TITLE } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx(),
      svgLoader({ svgoConfig: {} }),
      configArcoStyleImportPlugin(),
      // production
      configCompressPlugin("gzip"),
      configArcoResolverPlugin(),
      ViteEjsPlugin({
        title: VITE_APP_TITLE,
      }),
    ],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
        {
          find: "assets",
          replacement: resolve(__dirname, "src/assets"),
        },
        {
          find: "vue",
          replacement: "vue/dist/vue.esm-bundler.js", // compile template
        },
      ],
    },
    define: {
      "process.env": {},
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve(
              "src/theme/default/index.less",
            )}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks: {
            arco: ["@arco-design/web-vue"],
            chart: ["echarts", "vue-echarts"],
            vue: ["vue", "vue-router", "pinia", "@vueuse/core", "vue-i18n"],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
    server: {
      open: false,
      port: 8000,
      fs: {
        strict: true,
      },
    },
  };
};
