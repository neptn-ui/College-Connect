import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  className?: string;
  triggerOnce?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  triggerOnce = true
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, triggerOnce });

  const directionClass = {
    up: 'sr-up',
    left: 'sr-left',
    right: 'sr-right',
    scale: 'sr-scale'
  }[direction];

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${directionClass} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};
