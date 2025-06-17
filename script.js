document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'AIzaSyAHMUGk-lgVNdqAtZH5IHtaGtESIR-r8V0'; // ✅ 你的新 API 金鑰
  const channelId = 'UCTV2JFS__3qhIgCCgC8myoQ';
  const countElement = document.getElementById('subscriber-count');

  async function fetchSubscribers() {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("找不到頻道資料");
      }

      const count = parseInt(data.items[0].statistics.subscriberCount);
      countElement.textContent = `🎥 訂閱人數：${count.toLocaleString()} 人`;

      const milestones = document.querySelectorAll('.milestone');
      milestones.forEach(milestone => {
        const requiredSubs = parseInt(milestone.dataset.subs);
        if (count >= requiredSubs) {
          milestone.classList.remove('locked');
          milestone.classList.add('unlocked');
        } else {
          milestone.classList.remove('unlocked');
          milestone.classList.add('locked');
        }
      });
    } catch (error) {
      countElement.textContent = '⚠️ 訂閱數讀取失敗';
      console.error('訂閱 API 錯誤：', error);
    }
  }

  fetchSubscribers();
  setInterval(fetchSubscribers, 10000);

  // 🔽 里程碑收合按鈕
  const toggleBtn = document.getElementById('toggle-milestone');
  const milestoneSection = document.querySelector('.milestone-section');

  if (toggleBtn && milestoneSection) {
    toggleBtn.addEventListener('click', () => {
      const collapsed = milestoneSection.classList.toggle('collapsed');
      toggleBtn.textContent = collapsed ? '🔽 顯示里程碑' : '🔼 收起里程碑';
    });
  }

  // ✨ 動畫與 IntersectionObserver
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    typewriterEl.addEventListener('animationend', (e) => {
      if (e.animationName === 'typing') {
        typewriterEl.style.borderRight = 'none';
        typewriterEl.style.animation = 'none';
      }
    });
  }

  const selectors = ['.main-text.hidden', '.subs-count', '.text-group.hidden'];
  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('animate');
            el.classList.remove('hidden');
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    }
  });
});

// 🔗 社群區滾動功能
function scrollToSocial() {
  const target = document.getElementById("social");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
