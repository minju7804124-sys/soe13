const sections = [...document.querySelectorAll('main > section')];
const navLinks = [...document.querySelectorAll('.hotspot-nav a')];
const currentLabel = document.getElementById('currentLabel');
const topButton = document.querySelector('.back-to-top');
const sectionNames = {
  home: 'HOME',
  about: 'ABOUT',
  film: 'FILM',
  animation: 'ANIMATION',
  commercial: 'COMMERCIAL',
  works: 'WORKS',
  contact: 'CONTACT'
};

function installVideos() {
  document.querySelectorAll('.video-frame').forEach((frame) => {
    const src = frame.dataset.video;
    const poster = frame.dataset.poster;
    if (!src) return;

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = poster || '';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'metadata');

    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);

    video.addEventListener('canplay', () => {
      frame.classList.add('video-ready');
    }, { once: true });

    video.addEventListener('ended', () => {
      // Keep the last frame visible.
      video.pause();
    });

    video.addEventListener('error', () => {
      video.remove();
      frame.classList.remove('video-ready');
    }, { once: true });

    frame.appendChild(video);
    frame.dataset.played = 'false';
  });
}

function activeSectionId() {
  const midpoint = window.scrollY + Math.min(window.innerHeight * 0.28, 180);
  let current = sections[0]?.id || 'home';
  for (const section of sections) {
    if (midpoint >= section.offsetTop) current = section.id;
  }
  return current;
}

function updateUI() {
  const current = activeSectionId();
  currentLabel.textContent = sectionNames[current] || current.toUpperCase();

  navLinks.forEach((link) => {
    const target = link.getAttribute('href')?.slice(1);
    link.setAttribute('aria-current', target === current ? 'page' : 'false');
  });

  topButton.classList.toggle('show', window.scrollY > 700);
}

function tryPlayVisibleVideos() {
  document.querySelectorAll('.video-frame video').forEach((video) => {
    const frame = video.closest('.video-frame');
    if (!frame || frame.dataset.played === 'true') return;

    const rect = frame.getBoundingClientRect();
    const visible = rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.18;
    if (!visible) return;

    const playPromise = video.play();
    frame.dataset.played = 'true';

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        frame.dataset.played = 'false';
      });
    }
  });
}

installVideos();
updateUI();
tryPlayVisibleVideos();

window.addEventListener('scroll', () => {
  updateUI();
  tryPlayVisibleVideos();
}, { passive: true });

window.addEventListener('resize', updateUI);

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
