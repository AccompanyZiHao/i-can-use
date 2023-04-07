/**
 * @description: 全屏播放
 * @param {Function} fullscreenCallback 全屏回调
 * @param {Function} exitFullscreenCallback 退出全屏回调
 * @return {Object} { toggleFullScreen } 切换全屏
 */
export const useFullScreen = (fullscreenCallback, exitFullscreenCallback) => {
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {})
        .catch((err) => {
          // requestFullscreen() 通过拒绝返回的 Promise来生成错误条件，而不是抛出一个传统的异常。拒绝控制器接收以下的某一个值：
          // TypeError
          // 在以下几种情况下，会抛出TypeError：
          // 文档中包含的元素未完全激活，也就是说不是当前活动的元素。
          // 元素不在文档之内。
          // 因为功能策略限制配置或其他访问控制，元素不被允许使用"fullscreen"功能。
          // 元素和它的文档是同一个节点。
          console.log(err);
        });
    } else {
      exitFullscreen();
    }
  };

  const fullscreenChanged = (event) => {
    // 如果有元素处于全屏模式，则 document.fullscreenElement 将指向该元素。如果没有元素处于全屏模式，则该属性的值为 null。
    if (document.fullscreenElement) {
      console.log(`Element: entered fullscreen mode.`);
      fullscreenCallback && fullscreenCallback();
    } else {
      exitFullscreenCallback && exitFullscreenCallback();
      console.log('Leaving fullscreen mode.');
    }
  };
  document.onfullscreenchange = fullscreenChanged;

  return { toggleFullScreen, exitFullscreen };
};
