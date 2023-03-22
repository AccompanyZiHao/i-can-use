<template>
  <div class="prayer-wall">
    <div
      class="wall-item"
      :class="item.classNameList"
      v-for="(item, index) in praysWallList"
      :key="index"
    >
      <!-- :class="[...item.classNameList, isActivated ? '' : 'animation-pause']" -->
      <div class="img">
        <img
          :src="item.img"
          alt=""
          :round="true"
          width="0.4rem"
          height="0.4rem"
        />
      </div>
      <span>{{ item.content }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup name="prayer-wall">
import { inject, Ref, ref, watch, reactive, onUnmounted } from 'vue';

import { arrSplitChunk2 } from '@/utils/arrSplit';

export type praysWallType = {
  img: string; // 用户头像
  content: string; // 用户输入的弹幕信息
  userId?: number | string; // 用户 id
};

type barragePropsType = {
  list: praysWallType[]; // 弹幕列表
  userInfo: praysWallType; // 当前用户信息
  isActivated: boolean; // 组件是否激活
  highlightYourself?: boolean; // 是否高亮显示自己的弹幕
};

const props = defineProps<barragePropsType>();

// 弹幕轨道样式
const setWallItemClass = (i) => {
  // track.value++;
  // const i = Math.floor(Math.random() * 5);
  return [
    'wall-item-0',
    'wall-item-1',
    'wall-item-2',
    'wall-item-3',
    'wall-item-4',
  ][i];
  // [track.value % 5]
};

// 要显示的弹幕数组
const praysWallList = ref([]);

// 轨道队列
let trackQueue = reactive({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
});

// 新增弹幕
let addPray = null;
// 是否终止弹幕
let isStop = false;
// 终止时的缓存数据列表
let cacheList = [];
const setPraysWallList = (delay = 1000, list = [], trackIndex: number) => {
  if (isStop) {
    console.log('stop');
    return;
  }
  let timeId: NodeJS.Timer | null = null;
  timeId = setTimeout(() => {
    if (list.length === 0) {
      // console.log(trackIndex, '结束了，重新开始');
      clearTimeout(timeId);
      trackQueue[trackIndex] = null;
      start(props.list);
      return;
    }
    let cur = null;
    // 自己输入的弹幕
    if (addPray) {
      cur = { ...addPray, isOwn: true };
      addPray = null;
    } else {
      cur = { ...list.shift() };
      // 循环自己输入的弹幕需要高亮显示
      cur.isOwn =
        props.highlightYourself && props.userInfo.userId === cur.userId;
    }

    // const w = cur?.content ? getSize(cur.content) * 0.12 : 2;
    let classNameList = [setWallItemClass(trackIndex)];
    // 英文的为 20 个字符，阿语的为34个字符
    if (cur.content.length > (/[a-zA-Z]/.test(cur.content) ? 20 : 34)) {
      delay = Number(((4.25 + 0.17) / 15).toFixed(3)) * 10000;
      classNameList.push(cur.isOwn ? 'wall-item-own2' : 'wall-item2');
      cur.largeSize = true;
    } else {
      delay = Number(((2.85 + 0.17) / 15).toFixed(3)) * 10000;
      classNameList.push(cur.isOwn ? 'wall-item-own1' : 'wall-item1');
      cur.largeSize = false;
    }
    if (isStop) {
      // 有空再说吧。
      // cacheList.push({
      //   ...cur,
      //   classNameList,
      // });
    } else {
      praysWallList.value.push({
        ...cur,
        classNameList,
      });
    }

    // delay = Number((w / (7.5 + w)).toFixed(3)) * 7000;
    clearTimeout(trackQueue[trackIndex]);
    trackQueue[trackIndex] = null;
    setPraysWallList(delay, list, trackIndex);
  }, delay);
  trackQueue[trackIndex] = timeId;
};
const start = (arr) => {
  const list = arrSplitChunk2(arr, 5);
  // if (praysWallList.value.length >= 2 * props.list.length) {
  //   praysWallList.value.splice(0, props.list.length);
  // }
  list.forEach((item, index) => {
    if (!trackQueue[index]) {
      setPraysWallList(index * 200, [...item], index);
    }
  });
};
// watchEffect 死循环 因为 setPraysWallList 中 list.shift()，改变了原数组
let isFirst = true;
watch(
  () => props.list,
  (value) => {
    if (value && value.length > 0 && props.userInfo) {
      if (isFirst) {
        isFirst = false;
        start(value);
      } else {
        // 数据发生改变，一定是用户新增的
        addPray = value[value.length - 1];
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

// 清除队列
const clearTrackQueue = () => {
  isStop = true;
  clearTimeout(trackQueue[0]);
  clearTimeout(trackQueue[1]);
  clearTimeout(trackQueue[2]);
  clearTimeout(trackQueue[3]);
  clearTimeout(trackQueue[4]);
  trackQueue[0] = null;
  trackQueue[1] = null;
  trackQueue[2] = null;
  trackQueue[3] = null;
  trackQueue[4] = null;
  praysWallList.value = [];
};

// 组件是否被激活，
watch(
  () => props.isActivated,
  (val) => {
    if (val === true) {
      isStop = false;
      start(props.list);
    } else if (val === false) {
      isStop = true;
      clearTrackQueue();
    }
  }
);

//  const showList = computed(()=>{
//   if(!isStop){
//     return praysWallList.value
//   }
//  })

onUnmounted(() => {
  clearTrackQueue();
});
</script>

<style lang="scss" scoped>
.prayer-wall {
  width: 7rem;
  height: 4.2rem;
  border-radius: 0.1rem 0.1rem 0.1rem 0.1rem;
  background: #000;
  margin: 0.28rem auto 0.23rem auto;
  position: relative;
  overflow: hidden;
  .wall-item {
    animation: rightToLeft 10s linear both;
    height: 0.55rem;
    line-height: 0.55rem;
    border-radius: 0.275rem;
    position: absolute;
    padding-right: 0 0.15rem;
    white-space: nowrap;
    max-width: 7.5rem;
    display: flex;
    align-items: center;
    .img {
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      border: 0.02rem solid #fff;
      margin: 0 0.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    span {
      flex: 1;
      color: #fff;
      font-size: 0.24rem;
      overflow: hidden;
    }
  }
  .animation-pause {
    animation-play-state: paused;
  }
  .wall-item1 {
    width: 2.85rem;
    background: rgb(230, 220, 220, 0.6);
  }
  .wall-item-own1 {
    width: 2.85rem;
    background: linear-gradient(to bottom, #fe562f, #fff157);
  }
  .wall-item2 {
    width: 4.25rem;
    background: #d2cccc;
  }
  .wall-item-own2 {
    width: 4.25rem;
    background: linear-gradient(to bottom, #fe562f, #fff157);
  }
  .wall-item-0 {
    top: 0.27rem;
  }
  .wall-item-1 {
    top: 1.06rem;
  }
  .wall-item-2 {
    top: 1.83rem;
  }
  .wall-item-3 {
    top: 2.61rem;
  }
  .wall-item-4 {
    top: 3.35rem;
  }
}

.dr {
  .prayer-wall {
    .wall-item {
      animation: leftToRight 10s linear both;
    }
  }
}
@keyframes leftToRight {
  0% {
    transform: translate(-7.5rem);
  }
  100% {
    transform: translate(7.5rem);
  }
}
@keyframes rightToLeft {
  0% {
    transform: translate(7.5rem);
  }
  100% {
    transform: translate(-7.5rem);
  }
}
</style>
