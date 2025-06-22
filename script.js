document.addEventListener('DOMContentLoaded', () => {
  // ✅ YouTube 訂閱數 + 里程碑
  const apiKey = 'AIzaSyAHMUGk-lgVNdqAtZH5IHtaGtESIR-r8V0';
  const channelId = 'UCTV2JFS__3qhIgCCgC8myoQ';
  const countElement = document.getElementById('subscriber-count');

  async function fetchSubscribers() {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await res.json();
      if (!data.items || data.items.length === 0) throw new Error('找不到頻道資料');

      const count = parseInt(data.items[0].statistics.subscriberCount);
      countElement.textContent = `🎥 訂閱人數：${count.toLocaleString()} 人`;

      document.querySelectorAll('.milestone').forEach(m => {
        const need = parseInt(m.dataset.subs);
        m.classList.toggle('unlocked', count >= need);
        m.classList.toggle('locked', count < need);
      });
    } catch (e) {
      countElement.textContent = '⚠️ 訂閱數讀取失敗';
      console.error('訂閱 API 錯誤：', e);
    }
  }

  fetchSubscribers();
  setInterval(fetchSubscribers, 10000);

  // 🔽 收合/展開里程碑區塊
  const toggleBtn = document.getElementById('toggle-milestone');
  const milestoneSection = document.querySelector('.milestone-section');
  if (toggleBtn && milestoneSection) {
    toggleBtn.addEventListener('click', () => {
      const collapsed = milestoneSection.classList.toggle('collapsed');
      toggleBtn.textContent = collapsed ? '🔽 顯示里程碑' : '🔼 收起里程碑';
    });
  }

  // 🖋️ Typewriter 動畫結束移除光標
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    typewriterEl.addEventListener('animationend', (e) => {
      if (e.animationName === 'typing') {
        typewriterEl.style.borderRight = 'none';
        typewriterEl.style.animation = 'none';
      }
    });
  }

  // 👀 IntersectionObserver 動畫觸發
  ['.main-text.hidden', '.subs-count', '.text-group.hidden'].forEach(selector => {
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

  // 🔗 社群區滾動功能
  window.scrollToSocial = function () {
    const target = document.getElementById('social');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
});
