import React from 'react';
import styles from '@/styles/components/input.module.css';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  error,
  helperText,
  size = 'md',
  multiline = false,
  rows = 3,
}) => {
  const inputClass = `${styles.input} ${error ? styles.errorInput : ''} ${multiline ? styles.textarea : ''}`;

  return (
    <div className={`${styles.inputWrapper} ${styles[size]}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {multiline ? (
          <textarea
            className={inputClass}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            required={required}
            rows={rows}
          />
        ) : (
          <input
            type={type}
            className={inputClass}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            required={required}
          />
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};