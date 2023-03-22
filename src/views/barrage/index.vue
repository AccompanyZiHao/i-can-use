<template>
  <barrage :list="barrageList" :user-info="userInfo" />
  <button @click="addHandle">add</button>
</template>

<script setup lang="ts" name="barrage-index">
import { ref } from 'vue';
import barrage from './components/barrage.vue';
import { list } from './data';
const dataList = list.map((content) => {
  return {
    content,
    userId: Math.random() * 100000,
    img: '',
  };
});
const barrageList = ref(dataList);
const userInfo = {
  content: '',
  userId: 666888,
  img: '',
};
let i = 0;
const addHandle = () => {
  barrageList.value.push({
    content: '点击次数' + i++,
    userId: 666888,
    img: '',
  });
};
</script>

<style lang="scss" scoped>
button {
  width: 3rem;
  height: 0.6rem;
  display: block;
  margin: 0 auto;
  background: #409eff;
  border-radius: 0.3rem;
  border: 0;
  color: #fff;
}
</style>
