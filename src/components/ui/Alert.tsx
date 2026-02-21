import React from 'react';

export interface AlertProps {
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    dismissible?: boolean;
}

const variantConfig: Record<string, { bg: string; border: string; color: string; icon: string }> = {
    info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', color: '#60a5fa', icon: 'ℹ️' },
    success: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)', color: '#34d399', icon: '✓' },
    warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', color: '#fbbf24', icon: '⚠' },
    error: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', color: '#f87171', icon: '✕' },
};

export const Alert: React.FC<AlertProps> = ({ children, variant = 'info', title }) => {
    const cfg = variantConfig[variant];
    return (
        <div style={{
            padding: '14px 18px', borderRadius: 14,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
            <span style={{
                width: 24, height: 24, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                fontWeight: 700, backgroundColor: `${cfg.color}20`, color: cfg.color, flexShrink: 0,
            }}>{cfg.icon}</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {title && <div style={{ fontWeight: 600, fontSize: '0.85rem', color: cfg.color }}>{title}</div>}
                <div style={{ fontSize: '0.8rem', color: '#c8d0d9', lineHeight: 1.5 }}>{children}</div>
            </div>
        </div>
    );
};
