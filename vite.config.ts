import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path, { resolve } from "path";
import { ConfigEnv, loadEnv, UserConfig } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import svgLoader from "vite-svg-loader";
import configArcoResolverPlugin from "./build/plugin/arcoResolver";
import configArcoStyleImportPlugin from "./build/plugin/arcoStyleImport";
import configCompressPlugin from "./build/plugin/compress";

const CWD = process.cwd();
export default ({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === "production";
  const { VITE_BASE_PATH, VITE_APP_TITLE } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx(),
      svgLoader({
        svgo: false,
        defaultImport: "url",
      }),
      configArcoStyleImportPlugin(),
      // production
      configCompressPlugin("gzip"),
      configArcoResolverPlugin(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons/svg")],
        symbolId: "icon-[name]",
        svgoOptions: true,
      }),
    ],
    resolve: {
      alias: [
        {
          find: "#",
          replacement: resolve(__dirname),
        },
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
            hack: `true; 
            @import (reference) "${resolve("src/assets/style/breakpoint.less")}";
            @import (reference) "${resolve("src/theme/default/index.less")}";
            `,
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      sourcemap: !isProd,
      target: "esnext",
      rollupOptions: {
        output: {
          entryFileNames: "js/[name].[hash].js",
          chunkFileNames: "js/[name].[hash].js",
          assetFileNames({ name }) {
            const extType = path.extname(name).slice(1);
            if (/^(png|jpe?g|gif|svg)$/.test(extType)) {
              return `images/[name].[hash].[ext]`;
            } else if (extType === "css") {
              return `css/[name].[hash].[ext]`;
            } else {
              return `[name].[hash].[ext]`;
            }
          },
          manualChunks: {
            arco: ["@arco-design/web-vue"],
            chart: ["echarts", "vue-echarts"],
            vue: ["vue", "vue-router", "pinia", "@vueuse/core"],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
    server: {
      open: false,
      port: 8000,
    },
  };
};
