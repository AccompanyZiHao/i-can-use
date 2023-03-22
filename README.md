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

移动端适配

### arrSplit

切分数组

1. 按 `size` 分组
2. 分为 `size` 组

### getSize 获取字符串的字节数
