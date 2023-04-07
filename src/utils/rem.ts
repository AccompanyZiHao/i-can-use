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

// 获取 当前页面 document 的 font-size
export const getFontSize: number | null = (() => {
  let clientWidth = document.documentElement.clientWidth || null;
  if (!clientWidth) return null;
  clientWidth = clientWidth > 750 ? 750 : clientWidth;
  return 100 * (clientWidth / 750);
})();

let isM = JSON.parse(sessionStorage.getItem('isM')) || false;
// 判断是否是移动端
export function isMobile() {
  const mobileAgents = [
    'iphone',
    'ipod',
    'ipad',
    'android',
    'mobile',
    'blackberry',
    'webos',
    'incognito',
    'webmate',
    'bada',
    'nokia',
    'lg',
    'ucweb',
    'wap',
    'skyfire',
    'mobile',
    'symbian',
    'windows ce',
  ];
  const Browser = navigator.userAgent.toLowerCase();
  let isMobile = false;
  for (var i = 0; i < mobileAgents.length; i++) {
    if (Browser.indexOf(mobileAgents[i]) != -1) {
      isMobile = true;
      break;
    }
  }
  if (isM != isMobile) {
    // 移动端和PC端切换时，刷新页面
    location.reload();
  }
  isM = isMobile;
  sessionStorage.setItem('isM', JSON.stringify(isM));
  return isMobile;
}