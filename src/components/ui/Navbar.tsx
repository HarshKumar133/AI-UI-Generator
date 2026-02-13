import React from 'react';
import styles from '@/styles/components/navbar.module.css';

export interface NavLink {
  id: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface NavbarProps {
  brand?: string;
  brandIcon?: string;
  links?: NavLink[];
  actions?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  brandIcon,
  links = [],
  actions,
}) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        {brandIcon && <span className={styles.brandIcon}>{brandIcon}</span>}
        {brand}
      </div>
      {links.length > 0 && (
        <div className={styles.nav}>
          {links.map((link) => (
            <button
              key={link.id}
              className={`${styles.link} ${link.active ? styles.linkActive : ''}`}
              onClick={link.onClick}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
      {actions && <div className={styles.actions}>{actions}</div>}
    </nav>
  );
};