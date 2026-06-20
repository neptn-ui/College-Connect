import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { isPointerEnabled } = useTheme();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Position references
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isPointerEnabled) return;
    
    // Only enable on non-touch devices
    if (window.matchMedia('(hover: none)').matches) {
      setIsHidden(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Instantly move the dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('.cursor-pointer') !== null;
        
      setIsHovering(isClickable);
    };

    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Animation loop for the trailing ring
    let animationFrameId: number;
    const render = () => {
      // Lerp (linear interpolation) for smooth trailing
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPointerEnabled]);

  if (!isPointerEnabled || isHidden) return null;

  return (
    <>
      {/* The inner dot */}
      <div 
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-white rounded-full mix-blend-difference z-[9999] will-change-transform"
      />
      
      {/* The trailing ring wrapper (handles translation via JS without CSS transitions) */}
      <div 
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] will-change-transform flex items-center justify-center"
      >
        {/* Inner ring (handles scale and color transitions via CSS) */}
        <div 
          className={`w-8 h-8 -ml-4 -mt-4 border-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
            isHovering 
              ? 'border-brand bg-brand/10 scale-150 backdrop-blur-[2px]' 
              : 'border-white/50 scale-100'
          }`}
        >
          {isHovering && (
             <div className="w-full h-full rounded-full animate-ping opacity-20 bg-brand" />
          )}
        </div>
      </div>
    </>
  );
};
