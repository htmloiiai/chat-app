// ========== 小說章節讀取與格式化 ==========
function loadChapter(path) {
  fetch(`chapters/${path}`)
    .then((res) => {
      if (!res.ok) throw new Error("找不到章節檔案");
      return res.text();
    })
    .then((data) => {
      const formatted = formatChapterText(data);
      document.getElementById("content").innerHTML = formatted;
      playSound("click");
    })
    .catch((err) => {
      document.getElementById("content").innerHTML =
        `<p style="color: red;">❌ 載入失敗：${err.message}</p>`;
    });
}

// ========== 章節文字格式化（支援分支） ==========
function formatChapterText(text) {
  const lines = text.split("\n");
  let html = "";
  let inList = false;

  lines.forEach((line) => {
    line = line.trim();
    if (line.startsWith("#")) {
      html += `<h2>${line.substring(1).trim()}</h2>`;
    } else if (line.startsWith("!")) {
      html += `<p class="mission">${line.substring(1).trim()}</p>`;
    } else if (line.startsWith("*")) {
      html += `<h3>${line.substring(1).trim()}</h3>`;
    } else if (line.startsWith("-")) {
      if (!inList) {
        html += '<ul class="branch-list">';
        inList = true;
      }
      const [label, path] = line.substring(1).split("→").map((s) => s.trim());
      html += `<li><button class="branch-btn" onclick="loadChapter('${path}')">${label}</button></li>`;
    } else if (line === "") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    } else {
      html += `<p>${line}</p>`;
    }
  });

  if (inList) html += "</ul>";
  return html;
}

// ========== 留言系統 ==========
function postComment() {
  const input = document.getElementById("commentInput");
  const list = document.getElementById("commentList");
  const text = input.value.trim();
  if (text) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
    input.value = "";

    saveComments();
    playEffect();
    playSound("send");
  }
}

function saveComments() {
  const comments = [];
  document.querySelectorAll("#commentList li").forEach((li) => {
    comments.push(li.textContent);
  });
  localStorage.setItem("novel-comments", JSON.stringify(comments));
}

function loadComments() {
  const saved = JSON.parse(localStorage.getItem("novel-comments") || "[]");
  const list = document.getElementById("commentList");
  list.innerHTML = "";
  saved.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

// ========== 聲音播放 ==========
const sounds = {
  click: new Audio("sounds/click.mp3"),
  send: new Audio("sounds/send.mp3"),
  ambient: new Audio("sounds/ambient.mp3"),
};

function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}

// ========== 點擊特效（能量波） ==========
function playEffect() {
  const effect = document.createElement("div");
  effect.className = "pulse";
  document.body.appendChild(effect);
  setTimeout(() => effect.remove(), 600);
}

// ========== 視差背景 ==========
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  document.body.style.backgroundPosition = `${50 - x}% ${50 - y}%`;
});

// ========== 啟動 ==========
window.addEventListener("DOMContentLoaded", () => {
  loadChapter("chapter1/intro.txt"); // 預設從第一章開始
  loadComments();
  sounds.ambient.loop = true;
  sounds.ambient.volume = 0.4;
  sounds.ambient.play();
});
