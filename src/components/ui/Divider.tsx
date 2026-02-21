import React from 'react';

export interface DividerProps {
    label?: string;
    spacing?: 'sm' | 'md' | 'lg';
}

export const Divider: React.FC<DividerProps> = ({ label, spacing = 'md' }) => {
    const pad = spacing === 'sm' ? 8 : spacing === 'lg' ? 24 : 16;
    if (!label) {
        return <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: `${pad}px 0` }} />;
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: `${pad}px 0` }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>
    );
};
