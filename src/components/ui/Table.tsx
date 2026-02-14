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

function renderCellValue(value: unknown): React.ReactNode {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) {
        return value.map((v, i) => <span key={`v-${i}`}>{String(v)}</span>);
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

export const Table: React.FC<TableProps> = ({
    columns: columnsProp,
    data: dataProp,
    striped = false,
    hoverable = true,
    compact = false,
    emptyMessage = 'No data available',
}) => {
    const columns = columnsProp || [];
    const data = dataProp || [];
    const wrapperClass = `${styles.tableWrapper} ${striped ? styles.striped : ''} ${hoverable ? styles.hoverable : ''} ${compact ? styles.compact : ''}`;

    return (
        <div className={wrapperClass}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={`th-${idx}-${col.key}`} className={styles.th} style={col.width ? { width: col.width } : undefined}>
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
                            <tr key={`row-${i}`} className={styles.tr}>
                                {columns.map((col, j) => (
                                    <td key={`cell-${i}-${j}`} className={styles.td}>
                                        {renderCellValue(row[col.key])}
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