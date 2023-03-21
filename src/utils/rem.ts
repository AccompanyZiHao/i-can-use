const win = window;
const doc = document;

export function setRem() {
  let docEl = doc.documentElement;
  let resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
  let recalc = () => {
    let clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    if (clientWidth > 750) {
      clientWidth = 750;
    }
    //设置根元素font-size大小
    docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
  };
  //屏幕大小改变，或者横竖屏切换时，触发函数
  win.addEventListener(resizeEvt, recalc, false);
  recalc();
  //文档加载完成时，触发函数
  doc.addEventListener('DOMContentLoaded', recalc, false);
}

window.onresize = function () {
  setRem();
};
