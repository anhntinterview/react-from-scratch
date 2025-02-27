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
export const useEffect = (callback: () => void, getState: () => unknown) => {
  console.log("useEffect initialized");
  const listener = () => {
    console.log("State changed, calling effect");
    callback();
  };
  listener(); // Chạy effect ngay lần đầu

  // Đăng ký listener vào state (nếu getState có hỗ trợ subscribe)
  if (typeof getState === "function" && "subscribe" in getState) {
    (getState as any).subscribe(listener);
  }
};
