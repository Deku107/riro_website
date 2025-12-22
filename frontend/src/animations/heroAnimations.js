import gsap from 'gsap';

export const heroIntro = (root) => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const words = root.querySelectorAll('h1 span');
  const ctas = root.querySelectorAll('[data-hero-cta]');

  tl.from(words, {
    yPercent: 120,
    opacity: 0,
    duration: 0.9,
    stagger: 0.06,
  }).from(
    ctas,
    { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 },
    '-=0.4',
  );

  return tl;
};
