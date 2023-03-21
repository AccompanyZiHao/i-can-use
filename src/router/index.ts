import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const modulesConfig = import.meta.glob('@/views/**/config.ts', {
  import: 'default',
  eager: true,
});
const modulesCmp = import.meta.glob('@/views/**/index.vue');

const cmpObj = {};
Object.entries(modulesCmp).forEach(([k, cmp]) => {
  const key = k.match(/(?<=views).*(?=\/index.vue)/)[0].slice(1);
  cmpObj[key] = cmp;
});

const routerPage = Object.entries(modulesConfig).map(
  ([k, v]: [string, RouteRecordRaw]) => {
    const key = k.match(/(?<=views).*(?=\/config.ts)/)[0].slice(1);
    const path = key.replace(/\//g, '-');

    return {
      path: `${v.path || '/' + path}`,
      name: `${String(v.name) || path}`,
      component: cmpObj[key],
    };
  }
);

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routerPage],
});

export default router;
