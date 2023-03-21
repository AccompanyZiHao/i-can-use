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
        <Img
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
import {
  inject,
  Ref,
  ref,
  unref,
  watch,
  reactive,
  onUnmounted,
  computed,
} from 'vue';
import { wallList } from './data';
import { arrSplitChunk2 } from '@/utils/arrSplit';

export type praysWallType = {
  img: string;
  content: string;
  userId?: number | string;
};

const praysWall: Ref<praysWallType[]> = inject('praysWall');
const userInfo: Ref<any> = inject('userInfo');
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

const praysWallList = ref([]);

let trackQueue = reactive({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
});
// let addPray = ref(null);
let isStop = false;
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
      start(praysWall.value);
      return;
    }
    let cur = { ...list.shift() };
    // if (addPray.value) {
    //   cur = { ...addPray.value, isOwn: true };
    //   addPray.value = null;
    //   console.log(1111);
    // } else {
    // cur = list.shift();
    cur.isOwn = userInfo.value.userId === cur.userId;
    // }

    // const w = cur?.content ? getSize(cur.content) * 0.12 : 2;
    let classNameList = [setWallItemClass(trackIndex)];
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
  // if (praysWallList.value.length >= 2 * praysWall.value.length) {
  //   praysWallList.value.splice(0, praysWall.value.length);
  // }
  list.forEach((item, index) => {
    if (!trackQueue[index]) {
      setPraysWallList(0, [...item], index);
    }
  });
};
// watchEffect 死循环
let isFirst = true;
watch(
  () => praysWall.value,
  (value) => {
    if (value && value.length > 0 && userInfo.value) {
      if (isFirst) {
        isFirst = false;
        start(value);
      } else {
        // addPray.value = value[value.length - 1];
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

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

const isActivated = inject<Ref<boolean>>('isActivated');
watch(
  () => isActivated.value,
  (val) => {
    if (val === true) {
      isStop = false;
      start(praysWall.value);
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
  background: #f1ecb9;
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
    background: url(./../../../assets/ramadan/pray/bg_pary_1.png) no-repeat;
    background-size: 100% 100%;
  }
  .wall-item-own1 {
    width: 2.85rem;
    background: url(./../../../assets/ramadan/pray/bg_pary_own_1.png) no-repeat;
    background-size: 100% 100%;
  }
  .wall-item2 {
    width: 4.25rem;
    background: url(./../../../assets/ramadan/pray/bg_pary_2.png) no-repeat;
    background-size: 100% 100%;
  }
  .wall-item-own2 {
    width: 4.25rem;
    background: url(./../../../assets/ramadan/pray/bg_pary_own_2.png) no-repeat;
    background-size: 100% 100%;
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
