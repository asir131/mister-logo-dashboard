import React from 'react';
import { Search } from 'lucide-react';
interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
}
export function SearchBar({
  onSearch,
  className = '',
  ...props
}: SearchBarProps) {
  return <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-text-muted" />
      </div>
      <input type="text" className="
          w-full bg-surface border border-slate-700 rounded-lg 
          pl-10 pr-4 py-2
          text-text-primary placeholder-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-all duration-200
        " placeholder="Search..." onChange={e => onSearch(e.target.value)} {...props} />
    </div>;
}