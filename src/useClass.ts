import { CustomState, myEffect, randomColor } from "./stateClass.js";

// Tạo state giống React
const count = new CustomState<number>(0);

// Định nghĩa hàm xử lý sự kiện
const handleIncrement = () => count.setState(count.getState() + 1);
const handleDecrement = () => count.setState(count.getState() - 1);

// Map tên hàm với function
const eventHandlers: Record<string, () => void> = {
  handleIncrement,
  handleDecrement,
};

// Giao diện HTML (viết kiểu giống JSX)
const app = `
  <div>
    <h1>Counter</h1>
    <p id="counter">0</p>
    <button data-onclick="handleIncrement">+</button>
    <button data-onclick="handleDecrement">-</button>
  </div>
`;

/**
 * Tối ưu hóa bị leak memory
 * Hàm unsubscribe tất cả các hàm
 *
 */
let unsubscribeUI: (() => void) | null = null;
let unsubscribeEffect: (() => void) | null = null;

// Cập nhật UI khi state thay đổi
count.subscribe((value) => {
  const counterElement = document.getElementById("counter");
  if (counterElement) {
    counterElement.textContent = value.toString();
  }
});

if (typeof window !== "undefined") {
  window.onload = () => {
    document.body.innerHTML = app;

    // Event Delegation: Lắng nghe toàn bộ sự kiện click
    document.body.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const handlerName = target.dataset.onclick;
      if (handlerName && eventHandlers[handlerName]) {
        eventHandlers[handlerName]();
      }
    });

    // // Áp dụng useEffect để thay đổi màu nền khi count thay đổi
    // myEffect(() => {
    //   console.log("Changing background color"); // Debug
    //   document.body.style.backgroundColor = randomColor();
    // }, count as CustomState<unknown>);

    /**
     * Tối ưu hóa bị leak memory
     * Áp dụng useEffect MỚI để thay đổi màu nền khi count thay đổi
     *
     */
    // Đăng ký cập nhật UI khi state thay đổi và lưu lại hàm unsubscribe
    unsubscribeUI = count.subscribe((value) => {
      const counterElement = document.getElementById("counter");
      if (counterElement) {
        counterElement.textContent = value.toString();
      }
    });

    /**
     * Tối ưu hóa bị leak memory
     * Áp dụng myEffect MỚI để thay đổi màu nền và lưu lại hàm unsubscribe
     *
     *  */
    unsubscribeEffect = myEffect(() => {
      console.log("Changing background color");
      document.body.style.backgroundColor = randomColor();
    }, count as CustomState<unknown>);
  };

  /**
   * Áp dụng myEffect MỚI để thay đổi màu nền và lưu lại hàm unsubscribe
   * Hủy đăng ký khi trang đóng
   *
   *  */
  window.onpagehide = () => {
    unsubscribeUI?.();
    unsubscribeEffect?.();
  };
}
