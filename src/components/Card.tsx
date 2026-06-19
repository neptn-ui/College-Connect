import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  padding = 'md',
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

  return (
    <div 
      className={`${cardStyle} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
