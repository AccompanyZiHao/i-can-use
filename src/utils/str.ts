/**
 * @description: num转换保留小数点后几位, 不足补0，超出截取，不四舍五入
 * @param {number | string} data 数字
 * @param {number} n 保留几位
 * @return {string}
 */
export const numToFixed = (data: number | string, n): string => {
  if (!data) return;
  if (typeof data === 'number') {
    data = String(data);
  }
  if (data.indexOf('.') === -1) {
    const [before, after] = data.split('.');
    const afterStr = after?.length >= n ? after.slice(0, n) : (after || '0').padEnd(n, '0');
    return `${ before }.${ afterStr }`;
  }
  return data;
};