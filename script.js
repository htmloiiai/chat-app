document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'AIzaSyDvFDjXLUuy7m4GsZABDehLB_4hVcyKw4s';
  const channelId = 'UCTV2JFS__3qhIgCCgC8myoQ';
  const countElement = document.getElementById('subscriber-count');

  async function fetchSubscribers() {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );
      const data = await response.json();
      const count = parseInt(data.items[0].statistics.subscriberCount);
      countElement.textContent = `🎥 訂閱人數：${count.toLocaleString()} 人`;

      // 🔓 解鎖里程碑
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
      console.error('讀取訂閱數時發生錯誤：', error);
    }
  }

  fetchSubscribers();
  setInterval(fetchSubscribers, 10000); // 每 10 秒更新一次

  // ✨ 打字動畫結束後移除游標動畫（如果有）
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    typewriterEl.addEventListener('animationend', (e) => {
      if (e.animationName === 'typing') {
        typewriterEl.style.borderRight = 'none';
        typewriterEl.style.animation = 'none';
      }
    });
  }

  // 👁️‍🗨️ 元素出現時觸發動畫（main-text, subs-count, text-group）
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

// 👇 里程碑展開/收起功能
// 👇 里程碑展開/收起功能（動畫版）
const toggleBtn = document.getElementById('toggle-milestone');
const milestoneSection = document.querySelector('.milestone-section');

toggleBtn.addEventListener('click', () => {
  const collapsed = milestoneSection.classList.toggle('collapsed');
  toggleBtn.textContent = collapsed ? '🔽 顯示里程碑' : '🔼 收起里程碑';
});

