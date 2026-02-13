import React from 'react';
import styles from '@/styles/components/table.module.css';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, React.ReactNode>[];
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  striped = false,
  hoverable = true,
  compact = false,
  emptyMessage = 'No data available',
}) => {
  const wrapperClass = `${styles.tableWrapper} ${striped ? styles.striped : ''} ${hoverable ? styles.hoverable : ''} ${compact ? styles.compact : ''}`;

  return (
    <div className={wrapperClass}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyState}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className={styles.tr}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};