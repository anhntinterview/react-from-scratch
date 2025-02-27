import { useState, useEffect, randomColor } from "./stateFn.js";

// Khởi tạo state count với giá trị ban đầu là 0
const [getCount, setCount, subscribeCount] = useState<number>(0);

// Định nghĩa hàm xử lý sự kiện
const handleIncrement = () => {
  setCount(getCount() + 1);
  updateUI();
};
const handleDecrement = () => {
  setCount(getCount() - 1);
  updateUI();
};

// Map tên hàm với function
const eventHandlers: Record<string, () => void> = {
  handleIncrement,
  handleDecrement,
};

// Cập nhật UI khi state thay đổi
const updateUI = () => {
  const counterElement = document.getElementById("counter");
  if (counterElement) {
    counterElement.textContent = getCount().toString();
  }
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

if (typeof window !== "undefined") {
  window.onload = () => {
    console.log("Window loaded");
    document.body.innerHTML = app;

    // Event Delegation: Lắng nghe toàn bộ sự kiện click
    document.body.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const handlerName = target.dataset.onclick;
      if (handlerName && eventHandlers[handlerName]) {
        eventHandlers[handlerName]();
      }
    });

    useEffect(
      () => {
        document.body.style.backgroundColor = randomColor();
      },
      getCount,
      subscribeCount
    );

    useEffect(updateUI, getCount, subscribeCount);
  };
}
