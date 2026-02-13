import React from 'react';
import styles from '@/styles/components/card.module.css';

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  hoverable?: boolean;
  padding?: 'normal' | 'compact' | 'none';
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  hoverable = false,
  padding = 'normal',
  footer,
  headerAction,
}) => {
  const paddingClass = padding === 'none' ? styles.noPadding : padding === 'compact' ? styles.compact : '';

  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${paddingClass}`}>
      {(title || headerAction) && (
        <div className={styles.header}>
          <div>
            {title && <div className={styles.headerTitle}>{title}</div>}
            {subtitle && <div className={styles.headerSubtitle}>{subtitle}</div>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};