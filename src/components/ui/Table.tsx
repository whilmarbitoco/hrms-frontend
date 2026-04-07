import { ReactNode, Key, useContext, useMemo, useState, createContext } from 'react';
import { cn } from '../../lib/utils';
import { Modal } from './Modal';

interface TableContextValue {
  openRowDetails: (data: Record<string, unknown>) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

function getDisplayValue(value: unknown) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') {
    try {
      const serialized = JSON.stringify(value, null, 2);
      return serialized.length > 80 ? `${serialized.slice(0, 80)}…` : serialized;
    } catch {
      return String(value);
    }
  }
  return String(value);
}

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export function Table({ headers, children, className }: TableProps) {
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const contextValue = useMemo(
    () => ({
      openRowDetails: (data: Record<string, unknown>) => setDetails(data),
    }),
    []
  );
  return (
    <TableContext.Provider value={contextValue}>
      <div className={cn('w-full overflow-x-auto rounded-lg border border-slate-200 bg-white', className)}>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
      <Modal isOpen={Boolean(details)} onClose={() => setDetails(null)} title="Row details" size="sm">
        <div className="space-y-3">
          {details &&
            Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 text-sm">
                <span className="font-semibold text-slate-900">{key}</span>
                <span className="text-slate-500 text-right">{getDisplayValue(value)}</span>
              </div>
            ))}
        </div>
      </Modal>
    </TableContext.Provider>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  rowData?: Record<string, unknown>;
  key?: Key;
}

export function TableRow({ children, className, onClick, rowData }: TableRowProps) {
  const tableContext = useContext(TableContext);
  const handleClick = () => {
    if (rowData && tableContext) {
      tableContext.openRowDetails(rowData);
    }
    if (onClick) {
      onClick();
    }
  };
  const clickable = Boolean(onClick || rowData);
  return (
    <tr
      className={cn('hover:bg-slate-50 transition-colors', clickable && 'cursor-pointer', className)}
      onClick={handleClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export function TableCell({ children, className, colSpan }: TableCellProps) {
  return (
    <td colSpan={colSpan} className={cn('px-6 py-4 whitespace-nowrap text-slate-600', className)}>
      {children}
    </td>
  );
}
