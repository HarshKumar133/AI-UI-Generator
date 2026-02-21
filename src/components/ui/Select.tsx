'use client';
import React, { useState } from 'react';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    label?: string;
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Select: React.FC<SelectProps> = ({
    label, options, value: controlledValue, onChange, placeholder = 'Select...', disabled, size = 'md',
}) => {
    const [internalValue, setInternalValue] = useState('');
    const val = controlledValue !== undefined ? controlledValue : internalValue;
    const padMap = { sm: '7px 12px', md: '10px 14px', lg: '13px 18px' };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        setInternalValue(v);
        onChange?.(v);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {label && <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c8d0d9' }}>{label}</label>}
            <select
                value={val}
                onChange={handleChange}
                disabled={disabled}
                style={{
                    padding: padMap[size], fontSize: '0.85rem',
                    background: 'rgba(255,255,255,0.03)', color: val ? '#eceff2' : '#6b7280',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                    outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
                    paddingRight: 36, opacity: disabled ? 0.5 : 1,
                }}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} style={{ background: '#12161c', color: '#eceff2' }}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
