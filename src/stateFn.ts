export const useState = <T>(
  initialValue: T
): [
  () => T,
  (newValue: T) => void,
  (listener: (newState: T) => void) => void
] => {
  let state = initialValue;
  const listeners: ((newState: T) => void)[] = [];

  const getState = () => state;

  const setState = (newValue: T) => {
    state = newValue;
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener: (newState: T) => void) => {
    listeners.push(listener);
  };

  return [getState, setState, subscribe]; // Trả về thêm subscribe
};

// Hàm random màu sắc
export const randomColor = (): string => {
  console.log(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

// Custom useEffect
export const useEffect = <T>(
  callback: () => void,
  getState: () => T,
  subscribe: (listener: (newState: T) => void) => void
) => {
  let previousValue = getState();
  /**
   * Run at first time
   * /
  let isFirstRun = true;

  subscribe((newValue) => {
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    if (newValue !== previousValue) {
      previousValue = newValue;
      callback();
    }
  });
  */

  subscribe((newValue) => {
    if (newValue !== previousValue) {
      previousValue = newValue;
      callback();
    }
  });

  // Gọi callback ngay lần đầu tiên
  callback();
};
