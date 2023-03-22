/**
 * @description: 数组按 size 大小分组，每一组的长度为 size
 * @param {*} arr: 需要处理的数组
 * @param {*} size: 数组大小
 * @return {*} 返回一个数组
 */
export const arrSplitChunk = <T>(arr: T[], size: number): T[] => {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

/**
 * @description: 把数组分为 size 组，二维数组的长度为 size
 * @param {*} arr: 需要处理的数组
 * @param {*} size: 二维数组的长度
 * @return {*} 返回一个二维数组
 */
export const arrSplitChunk2 = <T>(arr: T[], size: number): T[][] => {
  let result = Array.from({ length: size }, () => []);
  for (let i = 0; i < arr.length; i++) {
    result[i % size].push(arr[i]);
  }
  return result;
};
