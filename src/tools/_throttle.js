// 立即执行版本
export default function _throttle(func, delay = 1000) {
  let timeoutID;
  return function () {
    const args = [...arguments];
    if (timeoutID) {
      return;
    }
    if (!timeoutID) {
      func.apply(this, args);
    }

    timeoutID = setTimeout(() => {
      timeoutID = null;
    }, delay);
  };
}
