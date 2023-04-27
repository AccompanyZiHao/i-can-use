import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from "rollup-plugin-visualizer";
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'
import externalGlobals from "rollup-plugin-external-globals";
import viteImagemin from 'vite-plugin-imagemin';
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';
import { viteExternalsPlugin } from "vite-plugin-externals";

export const plugins = [
  vue(),
  VueSetupExtend(),
  // vue 依旧打进去了
  // viteExternalsPlugin(
  //     {
  //       vue: "Vue",
  //       "element-plus": "ElementPlus",
  //       "vue-router": "VueRouter",
  //       axios: "axios",
  //     },
  //     {
  //       filter(code, id) {
  //         // 处理 pinia，解决 cdn 加载 Vue 响应式丢失问题
  //         if (id.includes("pinia")) {
  //           return true;
  //         }
  //         return false;
  //       },
  //     }
  // ),

  importToCDN({
    modules: [
      {
        name: 'vue',
        var: 'Vue',
        path: 'https://unpkg.com/vue@3.2.36/dist/vue.global.js'
      },
      {
        name: 'vue-router',
        var: 'VueRouter',
        path: 'https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js'
      },
      {
        name: 'axios',
        var: 'axios',
        path: 'https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js'
      },
      {
        name: 'element-plus',
        var: 'ElementPlus',
        path: 'https://unpkg.com/element-plus@2.3.4/dist/index.full.js',
        css: 'https://unpkg.com/element-plus@2.3.4/dist/index.css'
      },
      {
        name: 'VueDemi',
        var: 'VueDemi',
        path: 'https://cdn.jsdelivr.net/npm/vue-demi@0.14.0/lib/index.iife.min.js',
      },
      {
        name: 'pinia',
        var: 'Pinia',
        path: 'https://cdnjs.cloudflare.com/ajax/libs/pinia/2.0.35/pinia.iife.prod.js',
      }
    ]
  }),
  // 兼容ie11
  // legacy({
  //   targets: ['defaults', 'not IE 11'],
  // }),
  // Components({
  //   resolvers: [VantResolver(), ElementPlusResolver()],
  // }),
  // AutoImport({
  //   resolvers: [ElementPlusResolver()],
  // }),
  // tiny 压缩
  // viteImagemin({
  //   gifsicle: {
  //     optimizationLevel: 7,
  //     interlaced: false,
  //   },
  //   optipng: {
  //     optimizationLevel: 7,
  //   },
  //   mozjpeg: {
  //     quality: 20,
  //   },
  //   pngquant: {
  //     quality: [0.8, 0.9],
  //     speed: 4,
  //   },
  //   svgo: {
  //     plugins: [
  //       {
  //         name: 'removeViewBox',
  //       },
  //       {
  //         name: 'removeEmptyAttrs',
  //         active: false,
  //       },
  //     ],
  //   },
  // }),
  // 打包分析
  // visualizer({
  //   open: true,  //注意这里要设置为true，否则无效
  //   gzipSize: true,
  //   brotliSize: true
  // })
]