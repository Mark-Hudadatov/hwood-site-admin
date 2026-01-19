/**
 * PAGE TRANSITION
 * ================
 * Smooth fade transition between page navigations.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  duration = 200 
}) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current === location.pathname) {
      setDisplayChildren(children);
      return;
    }

    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setDisplayChildren(children);
      prevPathRef.current = location.pathname;
      
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [children, location.pathname, duration]);

  return (
    <div
      className={`
        transition-all ease-out
        ${isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}
      `}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
