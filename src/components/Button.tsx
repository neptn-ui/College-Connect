import React, { useRef, useState, MouseEvent } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Ripple effect
    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    if (onClick) onClick(e);
  };

  // Base styles uses theme CSS variables via tailwind arbitrary values, or global classes
  const baseStyle = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer overflow-hidden';

  const variants = {
    // using btn-glow from index.css for primary to ensure correct gradient mapping
    primary: 'btn-glow text-white border-transparent',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/15 backdrop-blur-sm',
    outline: 'border border-brand/40 text-brand-light hover:bg-brand/10 hover:border-brand/60',
    danger: 'bg-red-500/90 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/35 hover:-translate-y-0.5 border-transparent',
    ghost: 'text-text-secondary hover:bg-white/5 hover:text-white border-transparent'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={buttonRef}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 100, // diameter
            height: 100, // diameter
            marginLeft: -50, // center
            marginTop: -50, // center
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <svg className="animate-spin -ml-1 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </span>
    </button>
  );
};
