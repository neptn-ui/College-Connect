import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';
  
  const variants = {
    primary: 'bg-linear-to-r from-brand to-[#958ef0] text-white shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/35 hover:-translate-y-0.5',
    secondary: 'bg-white/10 dark:bg-white/5 border border-white/10 text-text-primary hover:bg-white/15 dark:hover:bg-white/10',
    outline: 'border border-brand text-brand hover:bg-brand/10',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 hover:shadow-red-500/35 hover:-translate-y-0.5',
    ghost: 'text-text-secondary hover:bg-brand/10 hover:text-brand'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
