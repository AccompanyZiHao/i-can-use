import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
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
});
