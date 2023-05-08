# 文件说明

## 路由

只有带有 `views` 目录下，含有 `config.ts` 的文件才会被注册为路由。

```ts
export default {
  name: 'barrage',
  path: '/barrage',
};
```

## utils

### rem

1. 移动端适配: `setRem`
2. 获取当前页面 `document` 的 `font-size`: `getFontSize`
3. 判断是否是移动端 `isMobile`

### arrSplit

切分数组

1. 按 `size` 分组
2. 分为 `size` 组

### getSize 获取字符串的字节数

### useFullScreen 使用全屏显示

### str 字符串方法

`numToFixed` 数字保留小数位数
