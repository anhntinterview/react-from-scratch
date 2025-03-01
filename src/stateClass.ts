export class CustomState<T> {
  private state: T;
  /**
   * 01. Dùng Array để lưu danh sách callback
   */
  // private listeners: ((newState: T) => unknown)[] = [];

  /**
   * 02. Dùng Set để lưu danh sách callback
   */
  // private listeners: Set<(newState: T) => void> = new Set();

  /**
   * 03. Dùng WeakMap để lưu danh sách callback theo key của object
   */
  // Vì WeakMap không hỗ trợ lặp qua tất cả phần tử,
  // ta sẽ dùng một Set để lưu danh sách key của WeakMap,
  // giúp gọi từng callback mà vẫn giữ cơ chế tự động dọn dẹp.
  private listeners = new WeakMap<object, (newState: T) => unknown>();
  private keys = new Set<object>(); // Lưu danh sách key để truy cập callback trong WeakMap

  constructor(initialValue: T) {
    this.state = initialValue;
  }

  getState(): T {
    return this.state;
  }

  /**
   * 01. setState với Array
   * @param newValue giá trị mới của state
   */
  // setState(newValue: T): void {
  //   this.state = newValue;
  //   this.listeners.forEach((listener) => listener(newValue));
  // }
  /**
   * 02. setState với Set
   * @param newValue giá trị mới của state
   */
  // setState(newValue: T): void {
  //   if (this.state !== newValue) {
  //     this.state = newValue;
  //     this.listeners.forEach((listener) => listener(newValue));
  //   }
  // }
  /**
   * 03. setState với WeakMap & Set
   * @param newValue giá trị mới của state
   */
  setState(newValue: T): void {
    if (this.state === newValue) return;

    this.state = newValue;
    this.keys.forEach((key) => {
      const callback = this.listeners.get(key);
      if (callback) callback(newValue);
    });
  }

  /**
   * 01. subscribe với Array
   * @param listener hàm callback
   */
  // subscribe(listener: (newState: T) => void): void {
  //   this.listeners.push(listener);
  // }

  /**
   * 02. subscribe với Set
   * @param listener hàm callback
   */
  // subscribe(listener: (newState: T) => void): () => void {
  //   this.listeners.add(listener);
  //   return () => this.listeners.delete(listener); // Trả về hàm để hủy đăng ký
  // }

  /**
   * 02. subscribe với WeakMap & Set
   * @param listener hàm callback
   */
  subscribe(listener: (newState: T) => void): () => void {
    const key = {}; // Key ẩn danh để WeakMap theo dõi
    this.listeners.set(key, listener);
    this.keys.add(key); // Lưu key để gọi lại sau

    return () => {
      this.listeners.delete(key);
      this.keys.delete(key);
    };
  }
}

// Khởi tạo state count với giá trị ban đầu là 0
export const count = new CustomState<number>(0);

// Hàm random màu sắc
export const randomColor = (): string => {
  console.log(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

/**
 * useEffect tương tự với React để thực thi callback khi state thay đổi
 * @param callback hàm callback
 * @param state state cần theo dõi
 */
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
export const myEffect = (
  callback: () => void,
  state: CustomState<unknown>
): (() => void) => {
  return state.subscribe(callback);
};
