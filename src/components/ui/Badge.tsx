import React from 'react';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    dot?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: 'rgba(255,255,255,0.06)', color: '#c8d0d9', border: '1px solid rgba(255,255,255,0.08)' },
    success: { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.15)' },
    warning: { background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.15)' },
    error: { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' },
    info: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.15)' },
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', dot }) => {
    const sizeStyles: React.CSSProperties = size === 'sm'
        ? { fontSize: '0.68rem', padding: '2px 8px' }
        : { fontSize: '0.78rem', padding: '4px 12px' };

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            borderRadius: '9999px', fontWeight: 600, letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            ...variantStyles[variant], ...sizeStyles,
        }}>
            {dot && <span style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: variantStyles[variant].color,
                flexShrink: 0,
            }} />}
            {children}
        </span>
    );
};
