export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const fadeIn = (direction = 'up', distance = 20) => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'left' || direction === 'up' ? 1 : -1;
  return {
    initial: { opacity: 0, [axis]: sign * distance },
    animate: {
      opacity: 1,
      [axis]: 0,
      transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
    },
  };
};
