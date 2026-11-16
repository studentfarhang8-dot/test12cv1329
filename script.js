(() => {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  const printButton = document.getElementById('print-cv');
  const year = document.getElementById('current-year');

  // Keep the footer current without requiring a manual edit each year.
  if (year) year.textContent = new Date().getFullYear();

  // Theme switch. The choice is remembered in this browser when storage is available.
  const savedTheme = (() => {
    try { return localStorage.getItem('cv-theme'); } catch { return null; }
  })();
  if (savedTheme === 'dark') body.classList.add('dark-theme');

  const updateThemeButton = () => {
    const dark = body.classList.contains('dark-theme');
    themeToggle?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle?.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  updateThemeButton();

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const value = body.classList.contains('dark-theme') ? 'dark' : 'light';
    try { localStorage.setItem('cv-theme', value); } catch { /* Storage may be unavailable; theme still changes. */ }
    updateThemeButton();
  });

  // Mobile navigation.
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  // The print dialog also lets visitors save the page as a PDF.
  printButton?.addEventListener('click', () => window.print());

  // Reveal sections as they enter the viewport; content remains visible without IntersectionObserver.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
})();
