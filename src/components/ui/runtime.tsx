'use client';

import React, { useId, useState } from 'react';

const colors = {
  accent: '#da4f2f',
  border: 'rgba(21, 18, 15, 0.12)',
  muted: '#766f66',
  surface: '#ffffff',
  text: '#15120f',
} as const;

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'default' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  children,
  disabled,
  fullWidth = false,
  size = 'md',
  style,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: colors.accent, borderColor: colors.accent, color: '#fff' },
    default: { background: colors.accent, borderColor: colors.accent, color: '#fff' },
    secondary: { background: '#f9f0e7', borderColor: '#ead9cc', color: colors.text },
    ghost: { background: 'transparent', borderColor: 'transparent', color: colors.text },
    outline: { background: '#fff', borderColor: colors.border, color: colors.text },
    danger: { background: '#d43d31', borderColor: '#d43d31', color: '#fff' },
    destructive: { background: '#d43d31', borderColor: '#d43d31', color: '#fff' },
  };
  const padding: Record<ButtonSize, string> = { sm: '6px 10px', md: '9px 14px', lg: '12px 18px' };

  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        border: '1px solid',
        borderRadius: 9,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 13,
        fontWeight: 650,
        opacity: disabled ? 0.55 : 1,
        padding: padding[size],
        transition: 'transform 150ms ease, background 150ms ease',
        width: fullWidth ? '100%' : undefined,
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  subtitle?: React.ReactNode;
  title?: React.ReactNode;
}

export function Card({
  children,
  footer,
  headerAction,
  hoverable = false,
  padding = 'md',
  style,
  subtitle,
  title,
  ...props
}: CardProps) {
  const spacing = { sm: 14, md: 20, lg: 28 }[padding];
  return (
    <section
      {...props}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        boxShadow: hoverable ? '0 10px 30px rgba(21,18,15,0.08)' : '0 2px 8px rgba(21,18,15,0.04)',
        padding: spacing,
        transition: hoverable ? 'transform 180ms ease, box-shadow 180ms ease' : undefined,
        ...style,
      }}
    >
      {(title || subtitle || headerAction) && (
        <header style={{ alignItems: 'flex-start', display: 'flex', gap: 12, justifyContent: 'space-between', marginBottom: children ? 16 : 0 }}>
          <div>
            {title && <div style={{ color: colors.text, fontSize: 16, fontWeight: 720 }}>{title}</div>}
            {subtitle && <div style={{ color: colors.muted, fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{subtitle}</div>}
          </div>
          {headerAction}
        </header>
      )}
      {children}
      {footer && <footer style={{ borderTop: `1px solid ${colors.border}`, marginTop: 16, paddingTop: 14 }}>{footer}</footer>}
    </section>
  );
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  error?: string;
  helperText?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  size?: ButtonSize;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export function Input({ error, helperText, label, multiline = false, onChange, rows = 3, size = 'md', style, ...props }: InputProps) {
  const inputStyle: React.CSSProperties = {
    border: `1px solid ${error ? '#d43d31' : colors.border}`,
    borderRadius: 9,
    boxSizing: 'border-box',
    color: colors.text,
    font: 'inherit',
    fontSize: size === 'sm' ? 12 : 14,
    outline: 'none',
    padding: size === 'lg' ? '12px 13px' : size === 'sm' ? '7px 9px' : '9px 11px',
    width: '100%',
    ...style,
  };
  return (
    <label style={{ color: colors.text, display: 'grid', fontSize: 13, fontWeight: 600, gap: 6 }}>
      {label}
      {multiline
        ? <textarea {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>} rows={rows} style={inputStyle} />
        : <input {...props} onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} style={inputStyle} />}
      {(error || helperText) && <span style={{ color: error ? '#d43d31' : colors.muted, fontSize: 12, fontWeight: 400 }}>{error || helperText}</span>}
    </label>
  );
}

export interface TableColumn {
  header: string;
  key: string;
}

export interface TableProps {
  columns: TableColumn[];
  compact?: boolean;
  data: Array<Record<string, unknown>>;
  emptyMessage?: string;
  hoverable?: boolean;
  striped?: boolean;
}

function cellValue(value: unknown): React.ReactNode {
  if (React.isValidElement(value) || typeof value === 'string' || typeof value === 'number') return value;
  if (value === null || value === undefined) return '—';
  return String(value);
}

export function Table({ columns, compact = false, data, emptyMessage = 'No data available', hoverable = true, striped = false }: TableProps) {
  const padding = compact ? '8px 10px' : '11px 14px';
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 12, overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 13, minWidth: '100%', width: '100%' }}>
        <thead style={{ background: '#fffaf4' }}>
          <tr>{columns.map((column) => <th key={column.key} style={{ color: colors.muted, fontSize: 11, letterSpacing: '0.06em', padding, textAlign: 'left', textTransform: 'uppercase' }}>{column.header}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={Math.max(columns.length, 1)} style={{ color: colors.muted, padding, textAlign: 'center' }}>{emptyMessage}</td></tr>
          ) : data.map((row, index) => (
            <tr key={index} style={{ background: striped && index % 2 ? '#fffaf4' : undefined, cursor: hoverable ? 'default' : undefined }}>
              {columns.map((column) => <td key={column.key} style={{ borderTop: `1px solid ${colors.border}`, color: colors.text, padding }}>{cellValue(row[column.key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface SidebarGroup { label?: string; items?: Array<{ active?: boolean; icon?: React.ReactNode; id: string; label: string }> }
export interface SidebarProps { collapsed?: boolean; footer?: React.ReactNode; groups?: SidebarGroup[]; items?: SidebarGroup['items']; title?: React.ReactNode; width?: number }

export function Sidebar({ collapsed = false, footer, groups, items, title, width = 240 }: SidebarProps) {
  const sections = groups || [{ items }];
  return (
    <aside style={{ background: '#fffaf4', borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', minHeight: '100%', width: collapsed ? 64 : width }}>
      {title && <div style={{ borderBottom: `1px solid ${colors.border}`, fontWeight: 750, padding: 18 }}>{collapsed ? '•' : title}</div>}
      <nav style={{ display: 'grid', gap: 14, padding: 10 }}>
        {sections.map((group, index) => <div key={index}>
          {!collapsed && group.label && <div style={{ color: colors.muted, fontSize: 10, fontWeight: 750, letterSpacing: '0.08em', padding: '6px 8px', textTransform: 'uppercase' }}>{group.label}</div>}
          {group.items?.map((item) => <button key={item.id} style={{ alignItems: 'center', background: item.active ? 'rgba(218,79,47,0.12)' : 'transparent', border: 0, borderRadius: 8, color: item.active ? colors.accent : colors.text, cursor: 'pointer', display: 'flex', font: 'inherit', gap: 8, padding: '9px 8px', textAlign: 'left', width: '100%' }}><span>{item.icon}</span>{!collapsed && item.label}</button>)}
        </div>)}
      </nav>
      {footer && <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: 'auto', padding: 14 }}>{footer}</div>}
    </aside>
  );
}

export interface ModalProps { children?: React.ReactNode; footer?: React.ReactNode; isOpen: boolean; onClose: () => void; size?: 'sm' | 'md' | 'lg' | 'xl'; title?: React.ReactNode }
export function Modal({ children, footer, isOpen, onClose, size = 'md', title }: ModalProps) {
  if (!isOpen) return null;
  const width = { sm: 400, md: 560, lg: 720, xl: 920 }[size];
  return <div onClick={onClose} role="presentation" style={{ alignItems: 'center', background: 'rgba(21,18,15,0.4)', display: 'grid', inset: 0, padding: 24, placeItems: 'center', position: 'fixed', zIndex: 50 }}><section aria-modal="true" onClick={(event) => event.stopPropagation()} role="dialog" style={{ background: '#fff', borderRadius: 16, maxWidth: width, overflow: 'hidden', width: '100%' }}><header style={{ alignItems: 'center', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', padding: '16px 20px' }}><strong>{title}</strong><button aria-label="Close" onClick={onClose} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 18 }}>×</button></header><div style={{ padding: 20 }}>{children}</div>{footer && <footer style={{ borderTop: `1px solid ${colors.border}`, padding: 16 }}>{footer}</footer>}</section></div>;
}

export interface NavLink { active?: boolean; href?: string; id?: string; label: string; onClick?: () => void }
export interface NavAction { label: string; onClick?: () => void; variant?: ButtonVariant }
export interface NavbarProps { actions?: NavAction[] | React.ReactNode; brand?: React.ReactNode; brandIcon?: React.ReactNode; items?: NavLink[]; links?: NavLink[] }
export function Navbar({ actions, brand, brandIcon, items, links }: NavbarProps) {
  const navLinks = links || items || [];
  return <nav style={{ alignItems: 'center', background: 'rgba(255,255,255,0.92)', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 16, justifyContent: 'space-between', padding: '13px 20px' }}><div style={{ alignItems: 'center', display: 'flex', fontWeight: 800, gap: 8 }}>{brandIcon}{brand}</div><div style={{ display: 'flex', gap: 4 }}>{navLinks.map((link, index) => <a href={link.href || '#'} key={link.id || index} onClick={link.onClick} style={{ color: link.active ? colors.accent : colors.muted, fontSize: 13, padding: '5px 8px', textDecoration: 'none' }}>{link.label}</a>)}</div><div style={{ display: 'flex', gap: 8 }}>{Array.isArray(actions) ? actions.map((action) => <Button key={action.label} onClick={action.onClick} size="sm" variant={action.variant}>{action.label}</Button>) : actions}</div></nav>;
}

export interface ChartPoint { label: string; value: number }
export interface ChartProps { data?: ChartPoint[]; height?: number; title?: React.ReactNode; type?: 'bar' | 'line' | 'pie' }
export function Chart({ data = [], height = 220, title, type = 'bar' }: ChartProps) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const total = Math.max(data.reduce((sum, point) => sum + point.value, 0), 1);
  const id = useId();
  const stops = data.reduce<{ cursor: number; values: string[] }>((state, point, index) => {
    const end = state.cursor + (point.value / total) * 100;
    state.values.push(`${['#da4f2f', '#3f82d8', '#2f9e63', '#f59e0b'][index % 4]} ${state.cursor}% ${end}%`);
    return { cursor: end, values: state.values };
  }, { cursor: 0, values: [] });
  return <figure style={{ margin: 0 }}><figcaption style={{ color: colors.text, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{title}</figcaption>{data.length === 0 ? <div style={{ color: colors.muted, height, paddingTop: 24 }}>No chart data</div> : type === 'pie' ? <div aria-label={`${id} pie chart`} style={{ background: `conic-gradient(${stops.values.join(', ')})`, borderRadius: '50%', height: Math.min(height, 220), margin: '0 auto', width: Math.min(height, 220) }} /> : <div aria-label={`${id} ${type} chart`} style={{ alignItems: 'end', display: 'flex', gap: 8, height }}>
    {data.map((point) => <div key={point.label} style={{ alignItems: 'center', display: 'grid', flex: 1, gap: 6, gridTemplateRows: '1fr auto', height: '100%' }}><div style={{ alignSelf: 'end', background: type === 'line' ? 'linear-gradient(180deg, #f07a60, #da4f2f)' : '#da4f2f', borderRadius: '7px 7px 2px 2px', height: `${Math.max((point.value / max) * 100, 4)}%` }} /><span style={{ color: colors.muted, fontSize: 10, overflow: 'hidden', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{point.label}</span></div>)}
  </div>}</figure>;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { dot?: boolean; size?: 'sm' | 'md'; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }
export function Badge({ children, dot = false, size = 'md', style, variant = 'default', ...props }: BadgeProps) {
  const palette = { default: ['#f4f2f0', colors.text], success: ['#e7f6ed', '#247a4b'], warning: ['#fff3d6', '#a15c00'], error: ['#ffe7e5', '#b52a22'], info: ['#e8f1ff', '#2867b2'] } as const;
  return <span {...props} style={{ alignItems: 'center', background: palette[variant][0], borderRadius: 999, color: palette[variant][1], display: 'inline-flex', fontSize: size === 'sm' ? 10 : 12, fontWeight: 700, gap: 5, padding: size === 'sm' ? '3px 7px' : '4px 9px', ...style }}>{dot && <span style={{ background: 'currentColor', borderRadius: '50%', height: 6, width: 6 }} />}{children}</span>;
}

export interface AvatarProps { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; src?: string; status?: 'online' | 'offline' | 'busy' | 'away' }
export function Avatar({ name, size = 'md', src, status }: AvatarProps) {
  const pixels = { sm: 28, md: 36, lg: 48, xl: 64 }[size];
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  return <span style={{ display: 'inline-flex', position: 'relative' }}>{src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={name} src={src} style={{ borderRadius: '50%', height: pixels, objectFit: 'cover', width: pixels }} />
  ) : <span aria-label={name} style={{ alignItems: 'center', background: 'linear-gradient(135deg, #da4f2f, #3f82d8)', borderRadius: '50%', color: '#fff', display: 'grid', fontSize: pixels * 0.34, fontWeight: 800, height: pixels, placeItems: 'center', width: pixels }}>{initials}</span>}{status && <span style={{ background: { online: '#2f9e63', offline: '#766f66', busy: '#d43d31', away: '#f59e0b' }[status], border: '2px solid white', borderRadius: '50%', bottom: 0, height: pixels * 0.28, position: 'absolute', right: 0, width: pixels * 0.28 }} />}</span>;
}

export interface ProgressProps { color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple'; label?: React.ReactNode; max?: number; showValue?: boolean; size?: 'sm' | 'md' | 'lg'; value: number }
export function Progress({ color = 'emerald', label, max = 100, showValue = true, size = 'md', value }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const colorMap = { emerald: '#2f9e63', blue: '#3f82d8', amber: '#f59e0b', red: '#d43d31', purple: '#8b5cf6' };
  return <div style={{ display: 'grid', gap: 6 }}>{(label || showValue) && <div style={{ display: 'flex', fontSize: 12, justifyContent: 'space-between' }}><span>{label}</span>{showValue && <span style={{ color: colors.muted }}>{Math.round(percentage)}%</span>}</div>}<div style={{ background: '#efece9', borderRadius: 999, height: { sm: 5, md: 8, lg: 11 }[size], overflow: 'hidden' }}><div style={{ background: colorMap[color], borderRadius: 'inherit', height: '100%', transition: 'width 220ms ease', width: `${percentage}%` }} /></div></div>;
}

export interface StatProps { icon?: React.ReactNode; label: React.ReactNode; subtitle?: React.ReactNode; trend?: { positive?: boolean; value: React.ReactNode } | React.ReactNode; value: React.ReactNode }
export function Stat({ icon, label, subtitle, trend, value }: StatProps) {
  const trendValue = typeof trend === 'object' && trend !== null && 'value' in trend ? trend.value : trend;
  const positive = typeof trend === 'object' && trend !== null && 'positive' in trend ? trend.positive !== false : true;
  return <div style={{ display: 'grid', gap: 5 }}><span style={{ color: colors.muted, fontSize: 12 }}>{icon} {label}</span><strong style={{ color: colors.text, fontSize: 27, letterSpacing: '-0.04em' }}>{value}</strong>{(trendValue || subtitle) && <span style={{ color: positive ? '#247a4b' : '#b52a22', fontSize: 12 }}>{trendValue} {subtitle && <span style={{ color: colors.muted }}>{subtitle}</span>}</span>}</div>;
}

export interface AlertProps { children: React.ReactNode; dismissible?: boolean; title?: React.ReactNode; variant?: 'info' | 'success' | 'warning' | 'error' }
export function Alert({ children, dismissible = false, title, variant = 'info' }: AlertProps) {
  const [visible, setVisible] = useState(true);
  const palette = { info: ['#e8f1ff', '#2867b2'], success: ['#e7f6ed', '#247a4b'], warning: ['#fff3d6', '#a15c00'], error: ['#ffe7e5', '#b52a22'] } as const;
  if (!visible) return null;
  return <div style={{ background: palette[variant][0], borderRadius: 10, color: palette[variant][1], display: 'flex', fontSize: 13, gap: 10, lineHeight: 1.5, padding: 12 }}><div style={{ flex: 1 }}>{title && <strong style={{ display: 'block', marginBottom: 3 }}>{title}</strong>}{children}</div>{dismissible && <button aria-label="Dismiss" onClick={() => setVisible(false)} style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer' }}>×</button>}</div>;
}

export interface ToggleProps { checked?: boolean; disabled?: boolean; label?: React.ReactNode; onChange?: (checked: boolean) => void; size?: 'sm' | 'md' }
export function Toggle({ checked, disabled = false, label, onChange, size = 'md' }: ToggleProps) {
  const [internal, setInternal] = useState(false);
  const active = checked ?? internal;
  const switchValue = () => { const next = !active; if (checked === undefined) setInternal(next); onChange?.(next); };
  const height = size === 'sm' ? 18 : 22;
  return <label style={{ alignItems: 'center', display: 'inline-flex', gap: 8, opacity: disabled ? 0.55 : 1 }}><button aria-checked={active} disabled={disabled} onClick={switchValue} role="switch" style={{ background: active ? colors.accent : '#d9d3ce', border: 0, borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer', height, padding: 2, width: height * 1.8 }}><span style={{ background: '#fff', borderRadius: '50%', display: 'block', height: height - 4, transform: active ? `translateX(${height * 0.8}px)` : undefined, transition: 'transform 160ms ease', width: height - 4 }} /></button>{label && <span style={{ fontSize: 13 }}>{label}</span>}</label>;
}

export interface TabItem { content?: React.ReactNode; icon?: React.ReactNode; id: string; label: React.ReactNode }
export interface TabsProps { defaultTab?: string; items: TabItem[]; onChange?: (id: string) => void }
export function Tabs({ defaultTab, items, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultTab || items[0]?.id);
  const selected = items.find((item) => item.id === active);
  return <div><div role="tablist" style={{ borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 4 }}>{items.map((item) => <button aria-selected={active === item.id} key={item.id} onClick={() => { setActive(item.id); onChange?.(item.id); }} role="tab" style={{ background: 'transparent', border: 0, borderBottom: active === item.id ? `2px solid ${colors.accent}` : '2px solid transparent', color: active === item.id ? colors.accent : colors.muted, cursor: 'pointer', padding: '9px 11px' }}>{item.icon} {item.label}</button>)}</div>{selected?.content && <div style={{ paddingTop: 14 }}>{selected.content}</div>}</div>;
}

export interface DividerProps { label?: React.ReactNode; spacing?: 'sm' | 'md' | 'lg' }
export function Divider({ label, spacing = 'md' }: DividerProps) { const margin = { sm: 8, md: 16, lg: 24 }[spacing]; return <div style={{ alignItems: 'center', display: 'flex', gap: 10, margin: `${margin}px 0` }}><span style={{ background: colors.border, flex: 1, height: 1 }} />{label && <span style={{ color: colors.muted, fontSize: 11, textTransform: 'uppercase' }}>{label}</span>}<span style={{ background: colors.border, flex: 1, height: 1 }} /></div>; }

export interface SelectOption { label: string; value: string }
export interface SelectProps { disabled?: boolean; label?: string; onChange?: (value: string) => void; options: SelectOption[]; placeholder?: string; size?: ButtonSize; value?: string }
export function Select({ disabled, label, onChange, options, placeholder = 'Select an option', size = 'md', value }: SelectProps) { return <label style={{ display: 'grid', fontSize: 13, fontWeight: 600, gap: 6 }}>{label}<select disabled={disabled} onChange={(event) => onChange?.(event.target.value)} style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 9, font: 'inherit', padding: size === 'sm' ? '7px 9px' : size === 'lg' ? '12px 13px' : '9px 11px' }} value={value}><option disabled value="">{placeholder}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>; }
