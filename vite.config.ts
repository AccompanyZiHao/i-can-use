import { defineConfig } from 'vite';
import { resolve } from 'path';
import { plugins } from './config/plugins';

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
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
  build: {
    sourcemap: false,

    rollupOptions: {
      // external: ['Vue', 'VueRouter', 'axios', 'ElementPlus'],
      // plugins: [
      //   externalGlobals({
      //     vue: 'Vue',
      //     axios: 'axios',
      //     'vue-router': 'VueRouter',
      //     ElementPlus: 'ElementPlus',
      //   })
      // ],
      output: {
        manualChunks: (id: string) => {
          // if (id.includes('node_modules')) {
          //   return 'vendor';
          // }
          // if (id.includes('src/assets/img')) {
          //   return 'img';
          // }
          // if (id.includes('src/views')) {
          //   return 'views';
          // }
          // if (id.includes('css')) {
          //   return 'css';
          // }
          return 'common';
        },
      },
    },
  }
});
