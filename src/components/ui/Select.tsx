import React from 'react';
import { ChevronDown } from 'lucide-react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
}
export function Select({
  label,
  options,
  className = '',
  ...props
}: SelectProps) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>}
      <div className="relative">
        <select className={`
            w-full bg-surface border border-slate-700 rounded-lg 
            pl-4 pr-10 py-2.5 appearance-none
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200
            cursor-pointer
            ${className}
          `} {...props}>
          {options.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-text-muted" />
        </div>
      </div>
    </div>;
}