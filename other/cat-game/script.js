let score = 0;
let clicks = 0;
const cat = document.getElementById("cat");
const scoreDisplay = document.getElementById("score");
const cpsDisplay = document.getElementById("cps");

let startTime = Date.now();
let lastClickTime = 0;  // 紀錄上一次點擊時間

cat.addEventListener("click", () => {
  score++;
  clicks++;
  lastClickTime = Date.now();
  scoreDisplay.textContent = score;
  playMeow();
});

function playMeow() {
  const meow = document.getElementById("meow").cloneNode();
  meow.currentTime = 0.2;
  meow.play();
}

setInterval(() => {
  const now = Date.now();
  const elapsed = (now - startTime) / 1000;
  const timeSinceLastClick = (now - lastClickTime) / 1000;

  if (timeSinceLastClick > 1) {
    // 超過1秒沒點擊，CPS顯示0
    cpsDisplay.textContent = `CPS：0`;
    // 可以重置起始時間和點擊數，讓下次計算更準確
    startTime = now;
    clicks = 0;
  } else {
    // 有點擊，正常計算CPS
    const cps = elapsed > 0 ? (clicks / elapsed).toFixed(2) : 0;
    cpsDisplay.textContent = `CPS：${cps}`;
  }
}, 100);
