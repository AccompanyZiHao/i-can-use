import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from "rollup-plugin-visualizer";
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'
import externalGlobals from "rollup-plugin-external-globals";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    Components({
      resolvers: [VantResolver(),ElementPlusResolver()],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),

    visualizer({
      open:true,  //注意这里要设置为true，否则无效
      gzipSize:true,
      brotliSize:true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // vue: 'https://unpkg.com/vue@3/dist/vue.global.js'
    },
    extensions: ['.js', '.json', '.ts', 'tsx'],
  },
  server: {
    open: false, // 服务启动时是否自动打开浏览器
    // cors: true, // 允许跨域
    proxy: {
      '/api': {
        target: 'http://XXX/',
        secure: false,
        changeOrigin: true,
        // rewrite: (path) => path.replace('^/faceshow', '/faceshow'),
      },
    },
  },
  // optimizeDeps: {
  //   exclude: ['Vue', 'VueRouter', 'axios', 'ElementPlus', 'ElementPlusIconsVue'],
  // },
  build:{
    sourcemap: false,

    rollupOptions: {
      external: [ 'Vue','VueRouter', 'axios', 'ElementPlus', 'ElementPlusIconsVue'],
      // external: ['vue', 'axios', 'vue-router'],
      plugins: [
        externalGlobals({
          vue: 'Vue',
          axios: 'axios',
          'vue-router': 'VueRouter',
          ElementPlus:'ElementPlus',
          ElementPlusIconsVue:'ElementPlusIconsVue'
        })
      ],
      output: {
        manualChunks: {
        },
      },
    },
  }
});
