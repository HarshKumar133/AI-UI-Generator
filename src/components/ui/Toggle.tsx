'use client';
import React, { useState } from 'react';

export interface ToggleProps {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked: controlledChecked, onChange, disabled, size = 'md' }) => {
    const [internalChecked, setInternalChecked] = useState(false);
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;
    const w = size === 'sm' ? 32 : 40;
    const h = size === 'sm' ? 18 : 22;
    const d = size === 'sm' ? 14 : 18;

    const handleClick = () => {
        if (disabled) return;
        const next = !isChecked;
        setInternalChecked(next);
        onChange?.(next);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: disabled ? 0.4 : 1 }}>
            <button
                onClick={handleClick}
                disabled={disabled}
                style={{
                    width: w, height: h, borderRadius: 9999, border: 'none', padding: 2,
                    background: isChecked ? '#10b981' : 'rgba(255,255,255,0.1)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'background 200ms ease', position: 'relative',
                    boxShadow: isChecked ? '0 0 8px rgba(16,185,129,0.3)' : 'none',
                }}
            >
                <div style={{
                    width: d, height: d, borderRadius: '50%', background: 'white',
                    transition: 'transform 200ms ease',
                    transform: isChecked ? `translateX(${w - d - 4}px)` : 'translateX(0)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
            </button>
            {label && <span style={{ fontSize: '0.82rem', color: '#c8d0d9', fontWeight: 500 }}>{label}</span>}
        </div>
    );
};
