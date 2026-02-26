document.addEventListener('DOMContentLoaded', function () {
(function () {
  const links = Array.from(document.querySelectorAll('a[data-lightbox="gallery"]'));
  console.log('[portfolio-lightbox] Ready:', links.length, 'images');
  if (!links.length) return;
  let currentIndex = 0;

  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,.86)';
  overlay.style.display = 'none';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.padding = '22px';

  const frame = document.createElement('div');
  frame.style.maxWidth = '1100px';
  frame.style.width = '100%';
  frame.style.maxHeight = '86vh';
  frame.style.display = 'grid';
  frame.style.gridTemplateRows = '1fr auto';
  frame.style.gap = '10px';

  const img = document.createElement('img');
  img.style.width = '100%';
  img.style.maxHeight = '78vh';
  img.style.objectFit = 'contain';
  img.style.borderRadius = '16px';
  img.style.border = '1px solid rgba(255,255,255,.15)';
  img.style.background = 'rgba(255,255,255,.03)';

  const bar = document.createElement('div');
  bar.style.display = 'flex';
  bar.style.alignItems = 'center';
  bar.style.justifyContent = 'space-between';
  bar.style.gap = '10px';
  bar.style.color = 'rgba(255,255,255,.86)';
  bar.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
  bar.style.fontWeight = '800';

  const caption = document.createElement('div');
  caption.style.flex = '1';
  caption.style.fontSize = '14px';
  caption.style.opacity = '.9';

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '8px';

  function makeBtn(label) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cursor = 'pointer';
    b.style.borderRadius = '999px';
    b.style.border = '1px solid rgba(255,255,255,.18)';
    b.style.background = 'rgba(255,255,255,.06)';
    b.style.color = 'white';
    b.style.padding = '10px 12px';
    b.style.fontWeight = '900';
    return b;
  }

  const prevBtn = makeBtn('‹ Prev');
  const nextBtn = makeBtn('Next ›');
  const closeBtn = makeBtn('✕ Close');
  controls.append(prevBtn, nextBtn, closeBtn);
  bar.append(caption, controls);
  frame.append(img, bar);
  overlay.append(frame);
  document.body.append(overlay);

  function setIndex(i) {
    currentIndex = (i + links.length) % links.length;
    const a = links[currentIndex];
    img.src = a.getAttribute('href');
    caption.textContent = a.getAttribute('data-caption') || '';
  }
  function openAt(i) {
    setIndex(i);
    overlay.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    overlay.style.display = 'none';
    document.documentElement.style.overflow = '';
  }

  links.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); openAt(i); }));
  prevBtn.addEventListener('click', () => setIndex(currentIndex - 1));
  nextBtn.addEventListener('click', () => setIndex(currentIndex + 1));
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  window.addEventListener('keydown', (e) => {
    if (overlay.style.display !== 'flex') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') setIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') setIndex(currentIndex + 1);
  });
})();
});