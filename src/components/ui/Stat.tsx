import React from 'react';

export interface StatProps {
    label: string;
    value: string | number;
    trend?: { value: string; positive?: boolean };
    icon?: string;
    subtitle?: string;
}

export const Stat: React.FC<StatProps> = ({ label, value, trend, icon, subtitle }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#8b99a6', letterSpacing: '0.02em' }}>{label}</span>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eceff2', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {(trend || subtitle) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                {trend && (
                    <span style={{
                        fontSize: '0.78rem', fontWeight: 600,
                        color: trend.positive !== false ? '#10b981' : '#ef4444',
                    }}>
                        {trend.positive !== false ? '↑' : '↓'} {trend.value}
                    </span>
                )}
                {subtitle && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{subtitle}</span>}
            </div>
        )}
    </div>
);
