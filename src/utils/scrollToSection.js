export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const navbarHeight = 80; // Account for fixed navbar
  const elementPosition = el.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};
