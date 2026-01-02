import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ElementType;
}
export function Input({
  label,
  error,
  helper,
  icon: Icon,
  className = '',
  ...props
}: InputProps) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>}
      <div className="relative">
        {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-muted" />
          </div>}
        <input className={`
            w-full bg-surface border border-slate-700 rounded-lg 
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            text-text-primary placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error-text focus:ring-error-text/50' : ''}
            ${className}
          `} {...props} />
      </div>
      {helper && !error && <p className="mt-1 text-xs text-text-muted">{helper}</p>}
      {error && <p className="mt-1 text-sm text-error-text">{error}</p>}
    </div>;
}