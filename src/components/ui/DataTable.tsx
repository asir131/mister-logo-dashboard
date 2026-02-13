import React from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}
export function DataTable<T extends {
  id: string;
}>({
  data,
  columns,
  onRowClick,
  actions
}: DataTableProps<T>) {
  return <div className="w-full overflow-x-auto rounded-lg border border-slate-700 bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/50 text-text-secondary uppercase text-xs font-semibold">
          <tr>
            {columns.map(col => <th key={col.key} className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-text-primary">
                  {col.header}
                  {col.sortable && <ChevronDown className="w-3 h-3" />}
                </div>
              </th>)}
            {actions && <th className="px-6 py-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {data.length > 0 ? data.map(item => <tr key={item.id} onClick={() => onRowClick && onRowClick(item)} className={`
                  transition-colors hover:bg-slate-800/30
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}>
                {columns.map(col => <td key={`${item.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-text-primary">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>)}
                {actions && <td className="px-6 py-4 text-right whitespace-nowrap">
                    {actions(item)}
                  </td>}
              </tr>) : <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-text-secondary">
                No data available
              </td>
            </tr>}
        </tbody>
      </table>
    </div>;
}
