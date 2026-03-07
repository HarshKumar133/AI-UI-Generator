import React from 'react';
import styles from '@/styles/components/navbar.module.css';
import { Button } from './button';

export interface NavLink {
  id?: string;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface NavAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
}

export interface NavbarProps {
  brand?: string;
  brandIcon?: string;
  links?: NavLink[];
  items?: NavLink[]; // Alias for links
  actions?: React.ReactNode | NavAction[];
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  brandIcon,
  links,
  items,
  actions,
}) => {
  // Alias items -> links
  const navLinks = links || items || [];

  // Safe rendering for actions
  const renderActions = () => {
    if (!actions) return null;

    const mapVariant = (
      variant?: NavAction['variant'],
    ): React.ComponentProps<typeof Button>['variant'] => {
      switch (variant) {
        case 'primary':
          return 'default';
        case 'danger':
          return 'destructive';
        case 'secondary':
          return 'secondary';
        case 'ghost':
        default:
          return 'ghost';
      }
    };

    // Handle array of actions
    if (Array.isArray(actions)) {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          {actions.map((action, idx) => (
            <Button
              key={`action-${idx}`}
              variant={mapVariant(action.variant)}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      );
    }

    // Handle single action object (if user passed just one object instead of array)
    // Checks if it looks like a NavAction (has label and maybe variant) but isn't a React Element
    const singleAction = actions as unknown as NavAction;
    if (typeof actions === 'object' && 'label' in singleAction && !React.isValidElement(actions)) {
      return (
        <Button
          variant={mapVariant(singleAction.variant)}
          size="sm"
          onClick={singleAction.onClick}
        >
          {singleAction.label}
        </Button>
      );
    }

    return actions as React.ReactNode;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        {brandIcon && <span className={styles.brandIcon}>{brandIcon}</span>}
        {brand}
      </div>
      {navLinks.length > 0 && (
        <div className={styles.nav}>
          {navLinks.map((link, idx) => (
            <a
              key={link.id || `link-${idx}`}
              href={link.href || '#'}
              className={`${styles.link} ${link.active ? styles.linkActive : ''}`}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <div className={styles.actions}>
        {renderActions()}
      </div>
    </nav>
  );
};