import { ref, unref, onMounted, onUnmounted } from 'vue';
import ClipboardJS from 'clipboard';
import { copyConfigType } from '@/type/copy';
import { fn } from '@/type/base';

export const Address: string = 'this is a test address of copy';

let clipboard = null;
let timerId: null | NodeJS.Timeout = null;

// 初始化
export function initClipboardJS(dom) {
  clipboard = new ClipboardJS(dom);
}

// 销毁
export function destroy() {
  clipboard.destroy();
  clearTimeout(Number(timerId));
}

export const useCopy = (copyConfig?: copyConfigType) => {
  const CopyStatus = ref<boolean>(false);
  const CopyRef = ref<HTMLElement | null>(null);
  // 复制
  function copyHandler(callback?: fn, errCallback?: fn) {
    clipboard.on('success', function (e) {
      e.clearSelection();
      if (unref(CopyStatus)) return;
      CopyStatus.value = true;
      callback && callback();
      timerId = setTimeout(() => {
        CopyStatus.value = false;
        clearTimeout(Number(timerId));
        timerId = null;
      }, copyConfig.delay || 3000);
    });

    clipboard.on('error', function (e) {
      errCallback && errCallback();
      console.error('Action:', e.action);
      CopyStatus.value = false;
    });
  }

  onMounted(() => {
    initClipboardJS(CopyRef.value);
  });
  onUnmounted(() => {
    destroy();
  });
  return { CopyStatus, CopyRef, copyHandler };
};
