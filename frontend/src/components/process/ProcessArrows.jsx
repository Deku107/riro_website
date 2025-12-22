import React from 'react';
import { ArrowDirection } from './types';
import { ArrowRight, ArrowDown, ArrowLeft } from './Icons';

export const ProcessArrow = ({ direction }) => {
  if (direction === ArrowDirection.None) return null;

  // We position these absolutely relative to the grid cell
  const baseClasses = "hidden lg:flex absolute items-center justify-center text-slate-300 z-0";
  
  let positionClasses = "";
  let IconComponent = ArrowRight;

  switch (direction) {
    case ArrowDirection.Right:
      // Positioned on the right edge, centering vertically
      positionClasses = "-right-8 top-1/2 -translate-y-1/2 translate-x-1/2";
      IconComponent = ArrowRight;
      break;
    case ArrowDirection.Left:
      // Positioned on the left edge, centering vertically
      positionClasses = "-left-8 top-1/2 -translate-y-1/2 -translate-x-1/2";
      IconComponent = ArrowLeft;
      break;
    case ArrowDirection.Down:
      // Positioned on the bottom edge, centering horizontally
      positionClasses = "-bottom-8 left-1/2 -translate-x-1/2 translate-y-1/2";
      IconComponent = ArrowDown;
      break;
  }

  return (
    <div className={`${baseClasses} ${positionClasses}`}>
      <IconComponent />
    </div>
  );
};

// Mobile arrow is much simpler, always down, rendered between items in the flex stack
export const MobileArrow = () => (
  <div className="flex lg:hidden justify-center py-4 text-slate-300">
    <ArrowDown />
  </div>
);
