import React from 'react';
import { useTiltEffect } from '../hooks/useTiltEffect';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  tiltEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  padding = 'md',
  tiltEffect = true,
  className = '',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3 md:p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8'
  };

  const cardStyle = hoverEffect 
    ? 'glass-card rounded-2xl overflow-hidden' 
    : 'glass-panel rounded-2xl overflow-hidden';
    
  const tiltRef = useTiltEffect(hoverEffect && tiltEffect) as React.RefObject<HTMLDivElement>;

  return (
    <div 
      ref={tiltRef}
      className={`${cardStyle} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
