export default function _debounce(func, delay = 1000) {
  let timeoutID;
  return function () {
    const args = [...arguments];
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      func.apply(this, args);
      timeoutID = null;
    }, delay);
  };
}
