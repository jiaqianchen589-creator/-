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
