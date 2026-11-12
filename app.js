const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.section-heading, .proof-card, .case-step, .tool-card, .video-card, .breadth-card').forEach((element) => {
  element.classList.add('reveal');
  observer.observe(element);
});

const imageDialog = document.querySelector('#image-dialog');
document.querySelectorAll('.image-open').forEach((button) => {
  button.addEventListener('click', () => {
    const source = button.dataset.full;
    const preview = button.querySelector('img');
    imageDialog.querySelector('img').src = source;
    imageDialog.querySelector('img').alt = preview?.alt || '成果原图';
    imageDialog.querySelector('p').textContent = preview?.alt || '';
    imageDialog.showModal();
  });
});
imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(value); return true; } catch (_) { /* local file fallback */ }
  }
  const field = document.createElement('textarea');
  field.value = value;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  return copied;
}
document.querySelectorAll('.copy-email').forEach((button) => {
  button.addEventListener('click', async () => {
    const copied = await copyText(button.dataset.copy);
    if (!copied) {
      const address = button.parentElement.querySelector('a');
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(address);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    button.textContent = copied ? '已复制' : '已选中，请复制';
    setTimeout(() => { button.textContent = '复制邮箱'; }, 2500);
  });
});

const roleViews = {
  strategy: ['从经营波动到可执行动作', '漏斗拆解 · 周会复盘 · 付费端断点定位', '#case', '看业务诊断案例 →'],
  ai: ['把重复分析做成团队工具', '2 天 → 1 小时 · 3,000+ 对话 AI 初筛', '#work', '看已交付工具 →'],
  business: ['用研究能力看懂经营结构', '英文商业研究 · 财报拆解 · SPSS / SQL', '#research', '看商业研究原稿 →'],
};
document.querySelectorAll('.role-choice').forEach((button) => {
  button.addEventListener('click', () => {
    const view = roleViews[button.dataset.role];
    if (!view) return;
    document.querySelectorAll('.role-choice').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#role-result-title').textContent = view[0];
    document.querySelector('#role-result-copy').textContent = view[1];
    const link = document.querySelector('#role-result-link');
    link.href = view[2];
    link.textContent = view[3];
  });
});
