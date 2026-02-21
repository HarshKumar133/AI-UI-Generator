import React from 'react';

export interface ProgressProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
}

const colorMap: Record<string, string> = {
    emerald: '#10b981', blue: '#3b82f6', amber: '#f59e0b', red: '#ef4444', purple: '#8b5cf6',
};

export const Progress: React.FC<ProgressProps> = ({
    value, max = 100, label, showValue = true, size = 'md', color = 'emerald',
}) => {
    const pct = Math.min(Math.max((value / max) * 100, 0), 100);
    const h = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;
    const barColor = colorMap[color] || colorMap.emerald;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
            {(label || showValue) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    {label && <span style={{ color: '#c8d0d9', fontWeight: 500 }}>{label}</span>}
                    {showValue && <span style={{ color: '#8b99a6', fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}%</span>}
                </div>
            )}
            <div style={{
                width: '100%', height: h, borderRadius: 9999,
                background: 'rgba(255,255,255,0.04)', overflow: 'hidden',
            }}>
                <div style={{
                    width: `${pct}%`, height: '100%', borderRadius: 9999,
                    background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
                    boxShadow: `0 0 8px ${barColor}30`,
                    transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                }} />
            </div>
        </div>
    );
};
