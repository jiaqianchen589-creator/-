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
    imageDialog.classList.remove('zoomed');
    imageDialog.querySelector('.dialog-zoom').textContent = '放大阅读 +';
    imageDialog.querySelector('.dialog-zoom').setAttribute('aria-pressed', 'false');
    imageDialog.showModal();
  });
});
imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.querySelector('.dialog-zoom').addEventListener('click', () => {
  const zoomed = imageDialog.classList.toggle('zoomed');
  const control = imageDialog.querySelector('.dialog-zoom');
  control.textContent = zoomed ? '还原画面 −' : '放大阅读 +';
  control.setAttribute('aria-pressed', String(zoomed));
});
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

// Self-contained demonstration: all values are illustrative and stay in the browser.
const demoForm = document.querySelector('#attendance-form');
if (demoForm) {
  const presets = {
    normal: { enrolled: '200', rate: '52.8', liveType: 'real', matched: true, duplicate: false },
    zero: { enrolled: '200', rate: '0', liveType: 'real', matched: true, duplicate: false },
    missing: { enrolled: '200', rate: '', liveType: 'real', matched: true, duplicate: false },
    duplicate: { enrolled: '200', rate: '52.8', liveType: 'real', matched: true, duplicate: true },
  };
  const result = document.querySelector('#demo-result');
  const explain = document.querySelector('#demo-explain');
  const output = document.querySelector('.demo-output');
  document.querySelectorAll('[data-demo]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = presets[button.dataset.demo];
      if (!preset) return;
      for (const [name, value] of Object.entries(preset)) {
        const field = demoForm.elements.namedItem(name);
        if (typeof value === 'boolean') field.checked = value;
        else field.value = value;
      }
      document.querySelectorAll('[data-demo]').forEach((item) => item.classList.toggle('active', item === button));
      demoForm.requestSubmit();
    });
  });
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = demoForm.elements;
    const enrolled = Number(fields.namedItem('enrolled').value);
    const rawRate = fields.namedItem('rate').value.trim();
    const rate = Number(rawRate);
    let title = '';
    let note = '';
    let blocked = true;
    if (!Number.isFinite(enrolled) || enrolled < 0) {
      title = '人数需要复核'; note = '请填写有效的模拟报名人数。';
    } else if (!fields.namedItem('matched').checked) {
      title = '已拦截：课程未匹配'; note = '先核对期次、年级、课程和主讲，再继续计算。';
    } else if (fields.namedItem('duplicate').checked) {
      title = '已拦截：重复记录'; note = '跨渠道出现同一课程记录；确认主键与归属后再汇总。';
    } else if (rawRate === '') {
      title = '已拦截：缺少历史数据'; note = '历史到课率缺失，不能用 0 代替；需要人工补齐口径。';
    } else if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      title = '到课率需要复核'; note = '请输入 0 到 100 之间的百分比。';
    } else if (rate === 0) {
      title = '已拦截：历史 0 值'; note = '0 可能表示未开课、未刷新或真实 0；人工确认后才能预测。';
    } else if (fields.namedItem('liveType').value === 'pseudo') {
      title = '已拦截：伪直播'; note = '直播类型影响到课计算；先按课程规则确认适用口径。';
    } else {
      blocked = false;
      title = `预估 ${Math.round(enrolled * rate / 100)} 人到课`;
      note = `${enrolled} 人 × ${rate}% 历史到课率。结果已生成，进入人工复核后再归档。`;
    }
    result.textContent = title;
    explain.textContent = note;
    output.classList.toggle('warn', blocked);
  });
}
