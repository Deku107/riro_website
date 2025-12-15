export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Element with id "${id}" not found`);
    return;
  }

  // Dynamic navbar height based on screen size
  const isMobile = window.innerWidth < 768; // md breakpoint
  const navbarHeight = isMobile ? 80 : 80; // Reduced mobile height for better positioning
  
  const elementPosition = el.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

// Enhanced version with retry mechanism for mobile
export const scrollToSectionWithRetry = (id, maxRetries = 3) => {
  let retryCount = 0;
  
  const attemptScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      scrollToSection(id);
      return true;
    }
    
    retryCount++;
    if (retryCount < maxRetries) {
      setTimeout(attemptScroll, 200);
    } else {
      console.warn(`Failed to find element "${id}" after ${maxRetries} retries`);
    }
    return false;
  };
  
  return attemptScroll();
};
