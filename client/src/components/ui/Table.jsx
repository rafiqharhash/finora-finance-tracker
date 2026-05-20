import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { clsx } from 'clsx';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';

/**
 * Table — sortable, responsive, with loading skeletons and empty state
 */
export default function Table({
  columns      = [],
  data         = [],
  loading      = false,
  emptyMessage = 'No data found',
  emptyIcon    = '📋',
  onSort,
  sortConfig   = { key: null, direction: 'asc' },
  className    = '',
  rowKey       = 'id',
  onRowClick,
}) {
  const handleSort = (key) => {
    if (!onSort) return;
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <ChevronsUpDown size={13} className="opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={13} className="text-primary-500" />
      : <ChevronDown size={13} className="text-primary-500" />;
  };

  return (
    <div className={clsx('table-wrapper', className)}>
      <table className="table-base">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(col.sortable && 'cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors')}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ width: col.width }}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && <SortIcon colKey={col.key} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <tr key={i}>
                <td colSpan={columns.length} className="p-0">
                  <Skeleton variant="table-row" />
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState icon={emptyIcon} title={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row[rowKey] || row._id || row.id}
                onClick={() => onRowClick?.(row)}
                className={clsx(onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
