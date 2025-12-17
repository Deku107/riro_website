import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8, // Reduced duration for faster scrolling
      smooth: true,
      lerp: 0.15, // Increased lerp for smoother but faster response
      wheelMultiplier: 0.8, // Reduce wheel sensitivity for better control
      touchMultiplier: 2, // Better touch support for mobile
      infinite: false, // Disable infinite scrolling
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return React.createElement(
    LenisContext.Provider,
    { value: lenisRef },
    children,
  );
};

export const useLenis = () => useContext(LenisContext);
