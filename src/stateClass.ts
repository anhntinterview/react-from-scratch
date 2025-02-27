export class CustomState<T> {
  private state: T;
  private listeners: ((newState: T) => void)[] = [];

  constructor(initialValue: T) {
    this.state = initialValue;
  }

  getState(): T {
    return this.state;
  }

  setState(newValue: T): void {
    this.state = newValue;
    this.listeners.forEach((listener) => listener(newValue));
  }

  subscribe(listener: (newState: T) => void): void {
    this.listeners.push(listener);
  }
}

// Khởi tạo state count với giá trị ban đầu là 0
export const count = new CustomState<number>(0);

// Cập nhật UI khi state thay đổi
export const updateUI = (value: number) => {
  const counterElement = document.getElementById("counter");
  if (counterElement) {
    counterElement.textContent = value.toString();
  }
};

// Hàm random màu sắc
export const randomColor = (): string => {
  console.log(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

// Custom useEffect
export const myEffect = (callback: () => void, state: CustomState<unknown>) => {
  console.log("useEffect initialized"); // Kiểm tra effect được khởi tạo
  state.subscribe(() => {
    console.log("State changed, calling effect"); // Kiểm tra state thay đổi
    callback();
  });
};
