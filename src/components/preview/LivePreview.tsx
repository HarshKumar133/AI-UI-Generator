'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface LivePreviewProps {
  code: string;
  outputMode?: 'tsx' | 'html' | 'nextjs'; // 'nextjs' = /preview route via Next.js native compilation
  title?: string;
  downloadPayload?: {
    filename: string;
    content: string;
    mimeType?: string;
    label?: string;
  };
}


// Base CSS for TSX-mode iframes
const IFRAME_BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #fffdf9;
    color: #15120f;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(21,18,15,0.14); border-radius: 3px; }
  * { outline-color: #da4f2f; }
  a { color: #da4f2f; text-decoration: none; }
  h1, h2, h3, h4, h5, h6 { letter-spacing: -0.02em; color: #15120f; line-height: 1.2; }
  p { color: #433d37; line-height: 1.65; }
  button { cursor: pointer; font-family: inherit; }
  input, select, textarea { font-family: inherit; }
`;

// All UI components as self-contained inline JS (no CSS modules, all inline styles)
const COMPONENT_REGISTRY_JS = `
// ── COMPONENT REGISTRY (inline, no CSS modules) ──

const Button = ({ children, variant = 'primary', size = 'md', disabled = false, fullWidth = false, onClick, type = 'button' }) => {
  const base = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, borderRadius: '10px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 150ms ease', fontFamily: 'inherit', letterSpacing: '-0.01em', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap', width: fullWidth ? '100%' : undefined };
  const sizes = { sm: { fontSize: '0.78rem', padding: '6px 12px' }, md: { fontSize: '0.85rem', padding: '9px 16px' }, lg: { fontSize: '0.92rem', padding: '12px 22px' } };
  const variants = {
    primary: { background: 'linear-gradient(135deg,#da4f2f,#f07a60)', color: '#fff', boxShadow: '0 0 20px rgba(218,79,47,0.25)' },
    secondary: { background: 'rgba(21,18,15,0.1)', color: '#15120f', border: '1px solid rgba(21,18,15,0.12)' },
    ghost: { background: 'transparent', color: '#433d37' },
    danger: { background: 'linear-gradient(135deg,#d43d31,#dc2626)', color: '#fff' },
    outline: { background: 'transparent', color: '#da4f2f', border: '1px solid rgba(218,79,47,0.35)' },
  };
  return React.createElement('button', { type, disabled, onClick, style: { ...base, ...sizes[size] || sizes.md, ...variants[variant] || variants.primary } }, children);
};

const Card = ({ children, title, subtitle, hoverable = false, footer, headerAction }) => {
  const [hovered, setHovered] = useState(false);
  return React.createElement('div', {
    onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false),
    style: { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(21,18,15,0.12)', borderRadius: '16px', overflow: 'hidden', transition: 'all 200ms ease', ...(hoverable && hovered ? { borderColor: 'rgba(218,79,47,0.2)', boxShadow: '0 8px 32px rgba(21,18,15,0.12)', transform: 'translateY(-2px)' } : {}) }
  },
    (title || headerAction) && React.createElement('div', { style: { padding: '16px 20px', borderBottom: '1px solid rgba(21,18,15,0.09)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' } },
      React.createElement('div', null,
        title && React.createElement('div', { style: { fontSize: '0.9rem', fontWeight: 700, color: '#15120f', letterSpacing: '-0.02em' } }, title),
        subtitle && React.createElement('div', { style: { fontSize: '0.76rem', color: '#8a7e72', marginTop: '3px' } }, subtitle)
      ),
      headerAction
    ),
    React.createElement('div', { style: { padding: '20px' } }, children),
    footer && React.createElement('div', { style: { padding: '14px 20px', borderTop: '1px solid rgba(21,18,15,0.09)', background: 'rgba(250,240,231,0.7)' } }, footer)
  );
};

const Input = ({ label, placeholder, type = 'text', value, onChange, error, disabled }) => {
  const [focused, setFocused] = useState(false);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
    label && React.createElement('label', { style: { fontSize: '0.78rem', fontWeight: 600, color: '#433d37', letterSpacing: '-0.01em' } }, label),
    React.createElement('input', {
      type, placeholder, value, disabled,
      onChange: onChange || (() => {}),
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: { width: '100%', padding: '10px 14px', background: 'rgba(21,18,15,0.08)', border: \`1px solid \${error ? '#d43d31' : focused ? '#da4f2f' : 'rgba(21,18,15,0.1)'}\`, borderRadius: '10px', color: '#15120f', fontSize: '0.85rem', outline: 'none', transition: 'border-color 150ms ease', fontFamily: 'inherit', opacity: disabled ? 0.5 : 1 }
    }),
    error && React.createElement('span', { style: { fontSize: '0.72rem', color: '#d43d31' } }, error)
  );
};

const Badge = ({ children, variant = 'default', size = 'sm', dot }) => {
  const variants = {
    default: { background: 'rgba(21,18,15,0.1)', color: '#433d37', border: '1px solid rgba(21,18,15,0.1)' },
    success: { background: 'rgba(218,79,47,0.12)', color: '#2f9e63', border: '1px solid rgba(218,79,47,0.15)' },
    warning: { background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.15)' },
    error: { background: 'rgba(212,61,49,0.12)', color: '#d43d31', border: '1px solid rgba(212,61,49,0.15)' },
    info: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.15)' },
  };
  const sizes = { sm: { fontSize: '0.68rem', padding: '2px 8px' }, md: { fontSize: '0.78rem', padding: '4px 12px' } };
  const v = variants[variant] || variants.default;
  return React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '9999px', fontWeight: 600, letterSpacing: '0.01em', whiteSpace: 'nowrap', ...v, ...sizes[size] } },
    dot && React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', backgroundColor: v.color, flexShrink: 0 } }),
    children
  );
};

const Stat = ({ label, value, trend, icon, subtitle }) => {
  const isPositive = typeof trend === 'string' ? trend.startsWith('+') : (trend && trend.positive !== false);
  const trendValue = typeof trend === 'string' ? trend : (trend && trend.value);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
      icon && React.createElement('span', { style: { fontSize: '1rem' } }, icon),
      React.createElement('span', { style: { fontSize: '0.75rem', fontWeight: 500, color: '#766f66', letterSpacing: '0.02em' } }, label)
    ),
    React.createElement('div', { style: { fontSize: '2rem', fontWeight: 800, color: '#15120f', letterSpacing: '-0.03em', lineHeight: 1.1 } }, typeof value === 'number' ? value.toLocaleString() : value),
    (trendValue || subtitle) && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 } },
      trendValue && React.createElement('span', { style: { fontSize: '0.78rem', fontWeight: 600, color: isPositive ? '#da4f2f' : '#d43d31' } }, (isPositive ? '↑ ' : '↓ ') + trendValue),
      subtitle && React.createElement('span', { style: { fontSize: '0.75rem', color: '#8a7e72' } }, subtitle)
    )
  );
};

const Alert = ({ children, variant = 'info', title }) => {
  const configs = {
    info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', color: '#60a5fa', icon: 'ℹ' },
    success: { bg: 'rgba(47,158,99,0.08)', border: 'rgba(47,158,99,0.22)', color: '#2f9e63', icon: '✓' },
    warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', color: '#fbbf24', icon: '⚠' },
    error: { bg: 'rgba(212,61,49,0.08)', border: 'rgba(212,61,49,0.15)', color: '#d43d31', icon: '✕' },
  };
  const c = configs[variant] || configs.info;
  return React.createElement('div', { style: { padding: '14px 18px', borderRadius: 14, background: c.bg, border: \`1px solid \${c.border}\`, display: 'flex', gap: 12, alignItems: 'flex-start' } },
    React.createElement('span', { style: { width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, backgroundColor: c.color + '20', color: c.color, flexShrink: 0 } }, c.icon),
    React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 } },
      title && React.createElement('div', { style: { fontWeight: 600, fontSize: '0.85rem', color: c.color } }, title),
      React.createElement('div', { style: { fontSize: '0.8rem', color: '#433d37', lineHeight: 1.5 } }, children)
    )
  );
};

const Progress = ({ value, max = 100, label, showValue = true, size = 'md', color = 'emerald' }) => {
  const colorMap = { emerald: '#da4f2f', blue: '#3b82f6', amber: '#f59e0b', red: '#d43d31', purple: '#8b5cf6' };
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const h = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;
  const barColor = colorMap[color] || colorMap.emerald;
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, width: '100%' } },
    (label || showValue) && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' } },
      label && React.createElement('span', { style: { color: '#433d37', fontWeight: 500 } }, label),
      showValue && React.createElement('span', { style: { color: '#766f66' } }, Math.round(pct) + '%')
    ),
    React.createElement('div', { style: { width: '100%', height: h, borderRadius: 9999, background: 'rgba(21,18,15,0.08)', overflow: 'hidden' } },
      React.createElement('div', { style: { width: \`\${pct}%\`, height: '100%', borderRadius: 9999, background: \`linear-gradient(90deg,\${barColor},\${barColor}dd)\`, boxShadow: \`0 0 8px \${barColor}30\`, transition: 'width 0.5s ease' } })
    )
  );
};

const Toggle = ({ label, checked: controlledChecked, onChange, disabled, size = 'md' }) => {
  const [internal, setInternal] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internal;
  const w = size === 'sm' ? 32 : 40; const h = size === 'sm' ? 18 : 22; const d = size === 'sm' ? 14 : 18;
  const handleClick = () => { if (disabled) return; const next = !isChecked; setInternal(next); onChange && onChange(next); };
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, opacity: disabled ? 0.4 : 1 } },
    React.createElement('button', { onClick: handleClick, disabled, style: { width: w, minWidth: w, height: h, borderRadius: 9999, border: 'none', padding: 2, background: isChecked ? '#da4f2f' : 'rgba(21,18,15,0.14)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 200ms', display: 'inline-flex', alignItems: 'center', flexShrink: 0, boxShadow: isChecked ? '0 0 8px rgba(218,79,47,0.3)' : 'none' } },
      React.createElement('div', { style: { width: d, height: d, borderRadius: '50%', background: 'white', transition: 'transform 200ms', transform: isChecked ? \`translateX(\${w - d - 4}px)\` : 'translateX(0)', flexShrink: 0 } })
    ),
    label && React.createElement('span', { style: { fontSize: '0.82rem', color: '#433d37', fontWeight: 500 } }, label)
  );
};

const Divider = ({ label, spacing = 'md' }) => {
  const pad = spacing === 'sm' ? 8 : spacing === 'lg' ? 24 : 16;
  if (!label) return React.createElement('div', { style: { height: 1, background: 'rgba(21,18,15,0.1)', margin: \`\${pad}px 0\` } });
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, margin: \`\${pad}px 0\` } },
    React.createElement('div', { style: { flex: 1, height: 1, background: 'rgba(21,18,15,0.1)' } }),
    React.createElement('span', { style: { fontSize: '0.68rem', fontWeight: 600, color: '#8a7e72', textTransform: 'uppercase', letterSpacing: '0.1em' } }, label),
    React.createElement('div', { style: { flex: 1, height: 1, background: 'rgba(21,18,15,0.1)' } })
  );
};

const Avatar = ({ name, status, size = 'md', src }) => {
  const sizeMap = { sm: 28, md: 36, lg: 48, xl: 64 };
  const px = sizeMap[size] || 36;
  const initials = name ? name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : '?';
  const statusColors = { online: '#da4f2f', offline: '#8a7e72', busy: '#d43d31', away: '#f59e0b' };
  return React.createElement('div', { style: { position: 'relative', display: 'inline-flex', flexShrink: 0 } },
    src
      ? React.createElement('img', { src, alt: name, style: { width: px, height: px, borderRadius: '50%', objectFit: 'cover' } })
      : React.createElement('div', { style: { width: px, height: px, borderRadius: '50%', background: 'linear-gradient(135deg,#da4f2f,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: px * 0.35 + 'px', fontWeight: 700, color: 'white' } }, initials),
    status && React.createElement('span', { style: { position: 'absolute', bottom: 0, right: 0, width: px * 0.3, height: px * 0.3, borderRadius: '50%', background: statusColors[status] || '#8a7e72', border: '2px solid #fffdf9' } })
  );
};

const Table = ({ columns = [], data = [], striped = false }) => {
  return React.createElement('div', { style: { overflow: 'auto', borderRadius: 12, border: '1px solid rgba(21,18,15,0.1)' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' } },
      React.createElement('thead', null,
        React.createElement('tr', null,
          columns.map((col, i) => React.createElement('th', { key: i, style: { padding: '10px 14px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: '#8a7e72', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(21,18,15,0.1)', background: 'rgba(250,240,231,0.72)', whiteSpace: 'nowrap' } }, col.header))
        )
      ),
      React.createElement('tbody', null,
        data.map((row, ri) => React.createElement('tr', { key: ri, style: { background: striped && ri % 2 === 1 ? 'rgba(21,18,15,0.03)' : 'transparent' } },
          columns.map((col, ci) => React.createElement('td', { key: ci, style: { padding: '10px 14px', color: '#433d37', borderBottom: ri < data.length-1 ? '1px solid rgba(21,18,15,0.08)' : 'none' } }, String(row[col.key] ?? '')))
        ))
      )
    )
  );
};

const Navbar = ({ brand, items = [], actions = [] }) => {
  return React.createElement('nav', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 58, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(21,18,15,0.1)', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 } },
    React.createElement('div', { style: { fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em', color: '#15120f' } }, brand),
    items.length > 0 && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
      items.map((item, i) => React.createElement('a', { key: i, href: item.href || '#', style: { padding: '6px 12px', fontSize: '0.83rem', color: '#766f66', fontWeight: 500, borderRadius: 8, textDecoration: 'none', transition: 'all 150ms' }, onMouseEnter: e => e.target.style.color = '#15120f', onMouseLeave: e => e.target.style.color = '#766f66' }, item.label))
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      actions.map((action, i) => React.createElement(Button, { key: i, variant: action.variant || 'ghost', size: 'sm' }, action.label))
    )
  );
};

const Sidebar = ({ title, groups = [], width = 220 }) => {
  const [active, setActive] = useState(null);
  return React.createElement('aside', { style: { width, minWidth: width, height: '100%', background: 'rgba(250,240,231,0.68)', borderRight: '1px solid rgba(21,18,15,0.1)', display: 'flex', flexDirection: 'column', overflow: 'auto', flexShrink: 0 } },
    title && React.createElement('div', { style: { padding: '20px 16px 12px', fontWeight: 800, fontSize: '0.92rem', letterSpacing: '-0.03em', color: '#15120f', borderBottom: '1px solid rgba(21,18,15,0.08)' } }, title),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '12px 0' } },
      groups.map((group, gi) => React.createElement('div', { key: gi, style: { marginBottom: 8 } },
        React.createElement('div', { style: { padding: '4px 16px 6px', fontSize: '0.62rem', fontWeight: 700, color: '#8a7e72', letterSpacing: '0.08em', textTransform: 'uppercase' } }, group.label),
        (group.items || []).map((item, ii) => {
          const isActive = active ? active === item.id : item.active;
          return React.createElement('button', { key: ii, onClick: () => setActive(item.id), style: { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: isActive ? 'rgba(218,79,47,0.1)' : 'transparent', border: 'none', borderLeft: \`2px solid \${isActive ? '#da4f2f' : 'transparent'}\`, color: isActive ? '#da4f2f' : '#766f66', fontSize: '0.82rem', fontWeight: isActive ? 600 : 500, cursor: 'pointer', transition: 'all 150ms', textAlign: 'left', fontFamily: 'inherit' } },
            item.icon && React.createElement('span', { style: { fontSize: '0.95rem' } }, item.icon),
            item.label
          );
        })
      ))
    )
  );
};

const Modal = ({ isOpen = false, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const widths = { sm: 400, md: 560, lg: 720 };
  return React.createElement('div', { onClick: onClose, style: { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(21,18,15,0.24)', backdropFilter: 'blur(4px)', zIndex: 1000, padding: 24 } },
    React.createElement('div', { onClick: e => e.stopPropagation(), style: { width: '100%', maxWidth: widths[size] || widths.md, background: '#fffdf9', border: '1px solid rgba(21,18,15,0.1)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(21,18,15,0.14)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(21,18,15,0.1)' } },
        React.createElement('div', { style: { fontWeight: 700, fontSize: '0.95rem', color: '#15120f' } }, title),
        React.createElement('button', { onClick: onClose, style: { background: 'none', border: 'none', color: '#8a7e72', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: 4 } }, '×')
      ),
      React.createElement('div', { style: { padding: 24 } }, children)
    )
  );
};

const Chart = ({ title, type = 'bar', data = [], height = 220 }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const COLORS = ['#da4f2f','#3b82f6','#f59e0b','#d43d31','#8b5cf6','#06b6d4'];
  const id = Math.random().toString(36).slice(2);
  if (type === 'bar') {
    return React.createElement('div', null,
      title && React.createElement('div', { style: { fontSize: '0.85rem', fontWeight: 600, color: '#15120f', marginBottom: 12, letterSpacing: '-0.02em' } }, title),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 8 } },
        data.map((d, i) => {
          const pct = Math.max((d.value / maxVal) * 100, 4);
          const color = d.color || COLORS[i % COLORS.length];
          return React.createElement('div', { key: i, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' } },
            React.createElement('span', { style: { fontSize: '0.58rem', color: '#766f66', fontWeight: 600 } }, d.value.toLocaleString()),
            React.createElement('div', { style: { width: '100%', borderRadius: '4px 4px 2px 2px', minHeight: 8, height: \`\${pct}%\`, background: color, boxShadow: \`0 0 10px \${color}30\` } }),
            React.createElement('span', { style: { fontSize: '0.58rem', color: '#8a7e72', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' } }, d.label)
          );
        })
      )
    );
  }
  if (type === 'line') {
    const W = 400, H = height, pad = 8;
    const cw = W - pad*2, ch = H - pad*3;
    const pts = data.map((d,i) => ({ x: pad + (i/Math.max(data.length-1,1))*cw, y: pad + ch - (d.value/maxVal)*ch }));
    const pathD = pts.map((p,i) => (i===0?'M':'L')+' '+p.x+' '+p.y).join(' ');
    const areaD = pathD + \` L \${pts[pts.length-1].x} \${H-pad} L \${pts[0].x} \${H-pad} Z\`;
    const gradId = 'lg_' + id;
    return React.createElement('div', null,
      title && React.createElement('div', { style: { fontSize: '0.85rem', fontWeight: 600, color: '#15120f', marginBottom: 8, letterSpacing: '-0.02em' } }, title),
      React.createElement('svg', { viewBox: \`0 0 \${W} \${H}\`, style: { width: '100%', height: 'auto' } },
        React.createElement('defs', null, React.createElement('linearGradient', { id: gradId, x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
          React.createElement('stop', { offset: '0%', stopColor: '#da4f2f', stopOpacity: '0.4' }),
          React.createElement('stop', { offset: '100%', stopColor: '#da4f2f', stopOpacity: '0.05' })
        )),
        React.createElement('path', { d: areaD, fill: \`url(#\${gradId})\` }),
        React.createElement('path', { d: pathD, fill: 'none', stroke: '#da4f2f', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' }),
        pts.map((p,i) => React.createElement('circle', { key: i, cx: p.x, cy: p.y, r: '5', fill: '#da4f2f', stroke: '#fffdf9', strokeWidth: '2.5' }))
      ),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginTop: 4 } },
        data.map((d,i) => React.createElement('span', { key: i, style: { fontSize: '0.6rem', color: '#8a7e72' } }, d.label))
      )
    );
  }
  // Pie chart
  const total = data.reduce((s,d) => s + d.value, 0) || 1;
  let cum = 0;
  const slices = data.map((d, i) => {
    const start = (cum/total)*360, angle = (d.value/total)*360;
    cum += d.value;
    const sr = ((start-90)*Math.PI)/180, er = ((start+angle-90)*Math.PI)/180;
    const large = angle > 180 ? 1 : 0;
    const color = d.color || COLORS[i % COLORS.length];
    const x1=90+75*Math.cos(sr), y1=90+75*Math.sin(sr), x2=90+75*Math.cos(er), y2=90+75*Math.sin(er);
    return React.createElement('path', { key: i, d: \`M 90 90 L \${x1} \${y1} A 75 75 0 \${large} 1 \${x2} \${y2} Z\`, fill: color, stroke: 'rgba(21,18,15,0.16)', strokeWidth: '1' });
  });
  return React.createElement('div', null,
    title && React.createElement('div', { style: { fontSize: '0.85rem', fontWeight: 600, color: '#15120f', marginBottom: 12 } }, title),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 24 } },
      React.createElement('svg', { viewBox: '0 0 180 180', style: { width: 140, height: 140, flexShrink: 0, filter: 'drop-shadow(0 4px 12px rgba(21,18,15,0.12))' } }, slices),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 } },
        data.map((d, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#433d37' } },
          React.createElement('div', { style: { width: 10, height: 10, borderRadius: '50%', background: d.color || COLORS[i % COLORS.length], flexShrink: 0 } }),
          React.createElement('span', { style: { flex: 1 } }, d.label),
          React.createElement('span', { style: { fontWeight: 600, color: '#15120f' } }, d.value.toLocaleString())
        ))
      )
    )
  );
};

const Select = ({ label, options = [], value, onChange, placeholder }) => {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
    label && React.createElement('label', { style: { fontSize: '0.78rem', fontWeight: 600, color: '#433d37' } }, label),
    React.createElement('select', { value, onChange: onChange || (() => {}), style: { width: '100%', padding: '10px 14px', background: 'rgba(21,18,15,0.08)', border: '1px solid rgba(21,18,15,0.1)', borderRadius: 10, color: '#15120f', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'none\\' viewBox=\\'0 0 24 24\\' stroke=\\'%238a7e72\\'%3E%3Cpath stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M19 9l-7 7-7-7\\'\\/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '14px', paddingRight: 36 } },
      placeholder && React.createElement('option', { value: '' }, placeholder),
      options.map((opt, i) => React.createElement('option', { key: i, value: opt.value }, opt.label))
    )
  );
};

const Tabs = ({ items = [], activeTab: controlled, onChange }) => {
  const [active, setActive] = useState(items[0]?.id);
  const current = controlled !== undefined ? controlled : active;
  return React.createElement('div', { style: { display: 'flex', gap: 2, background: 'rgba(21,18,15,0.06)', border: '1px solid rgba(21,18,15,0.1)', borderRadius: 12, padding: 4 } },
    items.map(item => {
      const isActive = current === item.id;
      return React.createElement('button', { key: item.id, onClick: () => { setActive(item.id); onChange && onChange(item.id); }, style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: 'none', background: isActive ? 'rgba(218,79,47,0.12)' : 'transparent', color: isActive ? '#da4f2f' : '#766f66', fontSize: '0.82rem', fontWeight: isActive ? 600 : 500, cursor: 'pointer', transition: 'all 150ms', fontFamily: 'inherit', whiteSpace: 'nowrap' } },
        item.icon && React.createElement('span', null, item.icon),
        item.label
      );
    })
  );
};
`;

/** Build TSX-mode iframe HTML (Babel transpiles the TSX code) */
function buildIframeHTML(code: string): string {
  const transformedCode = code
    .replace(/'use client';\s*/g, '')
    .replace(/"use client";\s*/g, '')
    .replace(/import React.*?from ['"]react['"];?\s*/g, '')
    .replace(/import\s+\{[^}]+\}\s+from\s+['"]@\/components\/ui['"];?\s*/g, '')
    .replace(/import\s+\{[^}]+\}\s+from\s+['"]@\/components\/ui\/[^'"]+['"];?\s*/g, '')
    .replace(/import\s+.*?from\s+['"]@\/[^'"]+['"];?\s*/g, '')
    .replace(/import\s+.*?from\s+['"](?!react)[^.@][^'"]*['"];?\s*/g, '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${IFRAME_BASE_CSS}</style>
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script>
// Expose all React hooks + APIs as globals (generated code uses them without React. prefix)
const {
  useState, useEffect, useCallback, useRef, useMemo,
  useReducer, useContext, useLayoutEffect, useId,
  createContext, forwardRef, memo, Fragment,
} = React;
${COMPONENT_REGISTRY_JS}
</script>
<script type="text/babel" data-presets="react,typescript">
${transformedCode}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(GeneratedUI));
</script>
</body>
</html>`;
}

/** Build direct HTML iframe (full-app mode — no Babel needed) */
function buildDirectHTML(html: string): string {
  if (!html.includes('<body')) {
    return `<!DOCTYPE html><html><head><style>body{background:#fffdf9;color:#15120f;font-family:system-ui,sans-serif;margin:0}*{box-sizing:border-box}</style></head><body>${html}</body></html>`;
  }
  return html;
}

// ── LivePreview Component ──

const LivePreview: React.FC<LivePreviewProps> = ({ code, outputMode = 'tsx', title, downloadPayload }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── NEXTJS MODE: simple iframe pointing at /preview ──
  // The file has already been written by page.tsx before this renders.
  // We send a postMessage to trigger a remount inside the /preview page.
  useEffect(() => {
    if (outputMode === 'nextjs') {
      // Give Turbopack a moment to detect the file change, then signal reload
      const timer = setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'RELOAD_PREVIEW' }, '*');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [code, outputMode]);

  const render = useCallback(() => {
    if (outputMode === 'nextjs') {
      return;
    }

    const iframe = iframeRef.current;
    if (!iframe || !code) return;

    setError(null);
    setLoading(true);

    const html = outputMode === 'html' ? buildDirectHTML(code) : buildIframeHTML(code);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_ERROR') {
        setError(e.data.message);
        setLoading(false);
      }
    };
    window.addEventListener('message', handleMessage);

    iframe.onload = () => {
      setLoading(false);
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.onerror = (msg, _src, _line, _col, err) => {
            const message = err?.message || String(msg);
            window.parent.postMessage({ type: 'PREVIEW_ERROR', message }, '*');
            return true;
          };
        }
      } catch { /* blob URLs are same-origin */ }
      URL.revokeObjectURL(url);
    };

    iframe.src = url;
    return () => window.removeEventListener('message', handleMessage);
  }, [code, outputMode]);

  useEffect(() => {
    if (outputMode === 'nextjs') {
      return;
    }
    let cleanup: void | (() => void);
    const timer = window.setTimeout(() => {
      cleanup = render();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [render, outputMode]);

  const handleOpenTab = useCallback(() => {
    const html = outputMode === 'html' ? buildDirectHTML(code) : buildIframeHTML(code);
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  }, [code, outputMode]);

  const handleDownload = useCallback(() => {
    const payloadContent = downloadPayload?.content || (outputMode === 'html' ? buildDirectHTML(code) : buildIframeHTML(code));
    const payloadType = downloadPayload?.mimeType || 'text/html';
    const blob = new Blob([payloadContent], { type: payloadType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadPayload?.filename || `${(title || 'app').toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [code, outputMode, title, downloadPayload]);

  if (outputMode === 'nextjs') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderBottom: '1px solid rgba(21,18,15,0.09)', flexShrink: 0, background: 'rgba(250,240,231,0.72)' }}>
          <span style={{ fontSize: '0.62rem', color: '#da4f2f', background: 'rgba(218,79,47,0.1)', border: '1px solid rgba(218,79,47,0.2)', borderRadius: 5, padding: '2px 7px', fontWeight: 700, letterSpacing: '0.06em' }}>⚙ NEXT.JS</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button onClick={() => window.open('/preview', '_blank')} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(21,18,15,0.1)', background: 'rgba(21,18,15,0.08)', color: '#766f66', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit' }}>
              ↗ Open
            </button>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <iframe
            ref={iframeRef}
            src="/preview"
            title="Next.js Live Preview"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block', minHeight: 300 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: 300 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderBottom: '1px solid rgba(21,18,15,0.09)', flexShrink: 0, background: 'rgba(250,240,231,0.72)' }}>
        {outputMode === 'html' && (
          <span style={{ fontSize: '0.62rem', color: '#da4f2f', background: 'rgba(218,79,47,0.1)', border: '1px solid rgba(218,79,47,0.2)', borderRadius: 5, padding: '2px 7px', fontWeight: 700, letterSpacing: '0.06em', marginRight: 'auto' }}>⚡ FULL APP</span>
        )}
        <div style={{ marginLeft: outputMode !== 'html' ? 'auto' : 0, display: 'flex', gap: 6 }}>
          <button onClick={handleOpenTab} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(21,18,15,0.1)', background: 'rgba(21,18,15,0.08)', color: '#766f66', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit' }} title="Open in new tab">
            ↗ Open
          </button>
          {(outputMode === 'html' || !!downloadPayload) && (
            <button onClick={handleDownload} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(218,79,47,0.25)', background: 'rgba(218,79,47,0.08)', color: '#da4f2f', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit' }} title={downloadPayload?.label || 'Download'}>
              {downloadPayload?.label || '↓ Download'}
            </button>
          )}
        </div>
      </div>

      {/* Preview area */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fffdf9', zIndex: 10, gap: 10, fontSize: '0.82rem', color: '#8a7e72' }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block', fontSize: '1rem' }}>⟳</span>
            Rendering preview…
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        {error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fffdf9', zIndex: 10, gap: 12, padding: 24 }}>
            <div style={{ fontSize: '1.5rem' }}>⚠️</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d43d31' }}>Preview Error</div>
            <div style={{ fontSize: '0.75rem', color: '#8a7e72', textAlign: 'center', maxWidth: 400, lineHeight: 1.6 }}>{error}</div>
            <button onClick={render} style={{ marginTop: 8, padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(212,61,49,0.3)', background: 'rgba(212,61,49,0.08)', color: '#d43d31', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>
              Retry
            </button>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', minHeight: 300, opacity: loading || error ? 0 : 1, transition: 'opacity 300ms ease' }}
        />
      </div>
    </div>
  );
};

export default LivePreview;
