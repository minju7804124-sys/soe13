const sections = [...document.querySelectorAll('main section')];
const navLinks = [...document.querySelectorAll('.nav a')];
const topButton = document.querySelector('.back-to-top');

const setActiveLink = () => {
  const y = window.scrollY + 180;
  let current = sections[0]?.id || 'home';
  for (const section of sections) {
    if (y >= section.offsetTop) current = section.id;
  }
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', () => {
  setActiveLink();
  topButton.classList.toggle('show', window.scrollY > 800);
});

setActiveLink();

topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
