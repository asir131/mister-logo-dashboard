import React from 'react';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ElementType;
}
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-gradient text-white hover:shadow-lg hover:shadow-primary/25 border border-transparent',
    secondary: 'bg-surface border border-slate-700 text-text-primary hover:bg-slate-800 hover:border-slate-600',
    danger: 'bg-red-500/10 text-error-text border border-red-500/20 hover:bg-red-500/20',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-slate-800/50'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : Icon ? <Icon className="w-4 h-4 mr-2" /> : null}
      {children}
    </button>;
}