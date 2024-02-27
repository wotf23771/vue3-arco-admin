import { resolve } from "path";
import { ConfigEnv, loadEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import configArcoStyleImportPlugin from "./plugin/arcoStyleImport";
import configCompressPlugin from "./plugin/compress";
import configVisualizerPlugin from "./plugin/visualizer";
import configArcoResolverPlugin from "./plugin/arcoResolver";

const CWD = process.cwd();
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_PATH } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx(),
      svgLoader({ svgoConfig: {} }),
      configArcoStyleImportPlugin(),
      // production
      configCompressPlugin("gzip"),
      configVisualizerPlugin(),
      configArcoResolverPlugin()
    ],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "../src")
        },
        {
          find: "assets",
          replacement: resolve(__dirname, "../src/assets")
        },
        {
          find: "vue-i18n",
          replacement: "vue-i18n/dist/vue-i18n.cjs.js" // Resolve the i18n warning issue
        },
        {
          find: "vue",
          replacement: "vue/dist/vue.esm-bundler.js" // compile template
        }
      ],
      extensions: [".ts", ".js"]
    },
    define: {
      "process.env": {}
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve(
              "src/assets/style/breakpoint.less"
            )}";`
          },
          javascriptEnabled: true
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            arco: ["@arco-design/web-vue"],
            chart: ["echarts", "vue-echarts"],
            vue: ["vue", "vue-router", "pinia", "@vueuse/core", "vue-i18n"]
          }
        }
      },
      chunkSizeWarningLimit: 2000
    },
    server: {
      open: false,
      port: 8000,
      fs: {
        strict: true
      }
    }
  };
};
