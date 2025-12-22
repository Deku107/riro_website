export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Element with id "${id}" not found`);
    return;
  }

  // Dynamic navbar height based on screen size
  const isMobile = window.innerWidth < 768; // md breakpoint
  const navbarHeight = isMobile ? 64 : 80; // Reduced mobile height
  
  const elementPosition = el.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

  // Use instant scroll for better performance, then smooth for final positioning
  window.scrollTo({
    top: offsetPosition,
    behavior: 'auto' // Use auto for instant response
  });
};

// Enhanced version with retry mechanism for mobile
export const scrollToSectionWithRetry = (id, maxRetries = 2) => { // Reduced retries
  let retryCount = 0;
  
  const attemptScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      scrollToSection(id);
      return true;
    }
    
    retryCount++;
    if (retryCount < maxRetries) {
      setTimeout(attemptScroll, 100); // Reduced timeout
    } else {
      console.warn(`Failed to find element "${id}" after ${maxRetries} retries`);
    }
    return false;
  };
  
  return attemptScroll();
};
