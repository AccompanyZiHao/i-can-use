import type { AxiosRequestConfig } from 'axios';
import service from '@/utils/http/http';
import { ResponseType } from '@/type/http';

export const http = {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseType<T>> {
    return service.get(url, config);
  },
  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<ResponseType<T>> {
    return service.post(url, data, config);
  },
  postForm<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<ResponseType<T>> {
    return service.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      ...config,
    });
  },
};
