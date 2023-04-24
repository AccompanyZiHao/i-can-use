import { ElMessageBox } from 'element-plus';
import { http } from '@/utils/http';
import { unref } from 'vue';
import { AxiosResponse } from 'axios';
import { formParams, dateFormat } from '@/utils/formatParams';

function onExport(url: string, params: any) {
  params = unref(params);
  http.get<AxiosResponse>(url, { params: formParams(params) }).then((resp) => {
    let filename = resp.headers['content-disposition']
      ?.split(';')[1]
      ?.replace('filename=', '');
    let blob = new Blob([resp.data], { type: 'text/csv' }); // 指定文件MIME
    let a = document.createElement('a');
    a.download = filename || dateFormat(+new Date(), 2).replace(/-|_| /g, ''); // 指定下载的文件名
    a.href = URL.createObjectURL(blob); // URL对象
    a.click(); // 模拟点击
  });
}

export const useExport = (url, params) => {
  ElMessageBox.confirm('Are you sure you want to export the file', 'Tips', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'info',
  })
    .then(() => {
      onExport(url, params);
    })
    .catch(() => {});
};
