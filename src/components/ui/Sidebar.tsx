import React from 'react';
import styles from '@/styles/components/sidebar.module.css';

export interface SidebarItem {
    id: string;
    label: string;
    icon?: string;
    active?: boolean;
    onClick?: () => void;
}

export interface SidebarGroup {
    label?: string;
    items: SidebarItem[];
}

export interface SidebarProps {
    title?: string;
    groups?: SidebarGroup[];
    items?: SidebarItem[];
    collapsed?: boolean;
    width?: 'sm' | 'md' | 'lg';
    footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
    title,
    groups,
    items,
    width = 'md',
    footer,
}) => {
    // Support both `groups` and flat `items` prop
    const resolvedGroups: SidebarGroup[] = groups && groups.length > 0
        ? groups
        : items && items.length > 0
            ? [{ items }]
            : [{ items: [] }];

    return (
        <div className={`${styles.sidebar} ${styles[`width${width.charAt(0).toUpperCase() + width.slice(1)}`]}`}>
            {title && (
                <div className={styles.header}>
                    <div className={styles.headerTitle}>{title}</div>
                </div>
            )}
            <div className={styles.content}>
                {resolvedGroups.map((group, gi) => (
                    <div key={`group-${gi}`} className={styles.group}>
                        {group.label && <div className={styles.groupLabel}>{group.label}</div>}
                        {(group.items || []).map((item, ii) => (
                            <button
                                key={item.id || `item-${ii}`}
                                className={`${styles.item} ${item.active ? styles.itemActive : ''}`}
                                onClick={item.onClick}
                            >
                                {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                                {item.label}
                            </button>
                        ))}
                        {gi < resolvedGroups.length - 1 && <div className={styles.divider} />}
                    </div>
                ))}
            </div>
            {footer && <div className={styles.footer}>{footer}</div>}
        </div>
    );
};