import React from 'react';
interface Tab {
  id: string;
  label: string;
  count?: number;
}
interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}
export function TabNavigation({
  tabs,
  activeTab,
  onTabChange
}: TabNavigationProps) {
  return <div className="border-b border-slate-700">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                ${isActive ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-slate-600'}
              `} aria-current={isActive ? 'page' : undefined}>
              {tab.label}
              {tab.count !== undefined && <span className={`
                  ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                  ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-800 text-text-secondary'}
                `}>
                  {tab.count}
                </span>}
            </button>;
      })}
      </nav>
    </div>;
}