export class CustomState<T> {
  private state: T;
  // private listeners: ((newState: T) => unknown)[] = [];
  /**
   * Dùng Set chứa các hàm callback tối ưu hóa bị leak memory
   */
  private listeners: Set<(newState: T) => void> = new Set();

  constructor(initialValue: T) {
    this.state = initialValue;
  }

  getState(): T {
    return this.state;
  }

  // setState(newValue: T): void {
  //   this.state = newValue;
  //   this.listeners.forEach((listener) => listener(newValue));
  // }
  /**
   * setState mới tối ưu hóa bị leak memory
   * @param newValue giá trị mới của state
   */
  setState(newValue: T): void {
    if (this.state !== newValue) {
      this.state = newValue;
      this.listeners.forEach((listener) => listener(newValue));
    }
  }

  // subscribe(listener: (newState: T) => void): void {
  //   this.listeners.push(listener);
  // }
  /**
   * subscribe mới tối ưu hóa bị leak memory
   * @param listener hàm callback
   * @returns
   */
  subscribe(listener: (newState: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // Trả về hàm để hủy đăng ký
  }
}

// Khởi tạo state count với giá trị ban đầu là 0
export const count = new CustomState<number>(0);

// Hàm random màu sắc
export const randomColor = (): string => {
  console.log(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

// // Custom useEffect
// export const myEffect = (callback: () => void, state: CustomState<unknown>) => {
//   console.log("useEffect initialized"); // Kiểm tra effect được khởi tạo
//   state.subscribe(() => {
//     console.log("State changed, calling effect"); // Kiểm tra state thay đổi
//     callback();
//   });
// };
/**
 * myEffect mới tối ưu hóa bị leak memory
 * @param callback
 * @param state
 * @returns
 */
export const myEffect = (callback: () => void, state: CustomState<unknown>) => {
  console.log("useEffect initialized");
  const unsubscribe = state.subscribe(() => {
    console.log("State changed, calling effect");
    callback();
  });
  return unsubscribe; // Trả về hàm để hủy effect nếu cần
};
