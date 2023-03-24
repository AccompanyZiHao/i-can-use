import axios from 'axios';
import { Toast } from 'vant';

const baseURL: string = import.meta.env.VITE_APP_BASE_URL || '';

const service = axios.create({
  withCredentials: true,
  timeout: 60000,
  baseURL,
});

service.interceptors.request.use(
  (config) => {
    // if (config.url.indexOf(login) == -1 || config.url.indexOf(captcha) == -1) {
    //   config.headers['token'] = state.token;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (res) => {
    const {
      data,
      status,
      config: { url },
    } = res;
    if (status === 200) {
      const { code, msg } = data;
      if (code !== 0) {
        Toast.fail(msg || 'error');
        if (code === 900001) {
        }
      }
      return Promise.resolve(data);
    } else {
      return Promise.reject(res);
    }
  },
  (err) => {
    const { response } = err;
    if (response) {
      Toast.fail(`${response.status}: ${response.statusText}`);
      return Promise.reject(response);
    } else {
      const msg = err.toString();
      if (msg == 'Cancel') {
        return false;
      }
      Toast.fail(msg);
    }
    return false;
  }
);

export default service;
