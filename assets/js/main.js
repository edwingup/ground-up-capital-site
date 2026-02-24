/* Ground Up Capital - minimal JS (no frameworks) */
(function () {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }));
  }

  // Active nav link
  const path = (location.pathname || '').split('/').pop() || 'index.html';
  $$('[data-nav] a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.endsWith(path)) a.classList.add('is-active');
  });

  // Convert data-prefill links to contact intent param
  $$('a[data-prefill]').forEach(a => {
    a.addEventListener('click', () => {
      const intent = a.getAttribute('data-prefill');
      const href = a.getAttribute('href') || '';
      if (href.includes('contact.html')) {
        const u = new URL(href, location.origin);
        u.searchParams.set('intent', intent);
        a.setAttribute('href', u.pathname + u.search + u.hash);
      }
    });
  });

  // Contact page: intent toggle + select
  const url = new URL(location.href);
  const intentButtons = $$('[data-intent]');
  const interestSelect = document.querySelector('select[name="interest"]');

  function setIntent(val){
    if (interestSelect) interestSelect.value = val;
    intentButtons.forEach(b => {
      const on = b.getAttribute('data-intent') === val;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  const qIntent = url.searchParams.get('intent');
  if (qIntent) setIntent(qIntent);

  if (intentButtons.length){
    intentButtons.forEach(b => b.addEventListener('click', () => setIntent(b.getAttribute('data-intent'))));
  }
  if (interestSelect){
    interestSelect.addEventListener('change', () => setIntent(interestSelect.value));
  }

  // Mailto form
  const form = document.querySelector('[data-mailto-form]');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const interest = (fd.get('interest') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      const subject = `[${interest}] Ground Up Capital`;
      const body =
`Name: ${name}
Email: ${email}
Interest: ${interest}

Message:
${message}

—
Sent via groundupcapital.com`;

      const mailto = `mailto:info@groundupholdings.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  }

  // Copy email
  const copyBtn = document.querySelector('[data-copy-email]');
  if (copyBtn && navigator.clipboard){
    copyBtn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText('info@groundupholdings.com');
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(() => copyBtn.textContent = prev, 1200);
      } catch(e){}
    });
  }

  // Portfolio filter
  const portfolioGrid = document.querySelector('#portfolio-grid');
  const typeChips = $$('[data-filter-type]');
  const marketChips = $$('[data-filter-market]');
  if (portfolioGrid && (typeChips.length || marketChips.length)){
    let type='all', market='all';
    const apply = () => {
      $$('#portfolio-grid .property').forEach(card => {
        const okType = (type==='all' || card.getAttribute('data-type')===type);
        const okMarket = (market==='all' || card.getAttribute('data-market')===market);
        card.style.display = (okType && okMarket) ? '' : 'none';
      });
    };
    const setActive = (chips, attr, val) => chips.forEach(c => c.classList.toggle('is-active', c.getAttribute(attr)===val));
    typeChips.forEach(c => c.addEventListener('click', () => { type=c.getAttribute('data-filter-type'); setActive(typeChips,'data-filter-type',type); apply(); }));
    marketChips.forEach(c => c.addEventListener('click', () => { market=c.getAttribute('data-filter-market'); setActive(marketChips,'data-filter-market',market); apply(); }));
    apply();
  }

  // Blog filter
  const blogCards = $$('#blog-grid .blog-card');
  const blogChips = $$('[data-blog-filter]');
  if (blogCards.length && blogChips.length){
    let cat='all';
    const apply = () => {
      blogCards.forEach(card => {
        const c = card.getAttribute('data-blog-category');
        card.style.display = (cat==='all' || c===cat) ? '' : 'none';
      });
      const featured = document.querySelector('.featured');
      if (featured){
        const fc = featured.getAttribute('data-blog-category');
        featured.style.display = (cat==='all' || fc===cat) ? '' : 'none';
      }
    };
    blogChips.forEach(chip => chip.addEventListener('click', () => {
      cat = chip.getAttribute('data-blog-filter');
      blogChips.forEach(c => c.classList.toggle('is-active', c===chip));
      apply();
    }));
    apply();
  }
})();