export interface ResponseType<T> {
  code: number;
  data: T;
  msg: string;
}
