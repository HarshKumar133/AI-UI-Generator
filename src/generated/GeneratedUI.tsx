// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// --- Theme & Styles (Mimicking Chakra) ---
const theme = {
  colors: {
    primaryBlue: '#007ACC',
    accentCyan: '#00BCD4',
    brandRed: '#E53E3E',
    backgroundLight: '#F7FAFC', // Not used as primary bg due to dark theme
    surfaceDark: 'rgba(26, 32, 44, 0.8)', // Semi-transparent dark for panels
    textLight: '#E2E8F0',
    textDark: '#2D3748',
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
    gradientStart: '#003366', // Deep blue for background gradient
    gradientEnd: '#007ACC',   // Primary blue for background gradient
  },
  shadows: {
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  typography: {
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    body: { fontSize: '1rem', lineHeight: 1.5 },
    small: { fontSize: '0.875rem', lineHeight: 1.4 },
  },
  transitions: {
    default: 'all 0.3s ease-in-out',
    fast: 'all 0.15s ease-out',
  },
};

// --- Utility Components (Mimicking Chakra's Box/Flex) ---
interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  as?: React.ElementType; // For semantic HTML
}

const Box: React.FC<BoxProps> = ({ children, style, className, as: Component = 'div', ...props }) => (
  <Component style={style} className={className} {...props}>{children}</Component>
);

interface FlexProps extends BoxProps {
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string;
}

const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  wrap = 'nowrap',
  gap,
  style,
  className,
  ...props
}) => (
  <Box
    style={{
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
      gap,
      ...style,
    }}
    className={className}
    {...props}
  >
    {children}
  </Box>
);

interface TextProps extends BoxProps {
  fontSize?: keyof typeof theme.typography | string;
  fontWeight?: string | number;
  color?: string;
}

const Text: React.FC<TextProps> = ({ children, fontSize, fontWeight, color, style, ...props }) => {
  const baseStyle: React.CSSProperties = (() => {
    if (!fontSize) return {};
    const preset = theme.typography[fontSize as keyof typeof theme.typography];
    if (typeof preset === 'object' && preset !== null) {
      return preset;
    }
    return { fontSize: fontSize as React.CSSProperties['fontSize'] };
  })();
  return (
    <Box
      style={{
        fontFamily: theme.typography.fontFamily,
        ...baseStyle,
        fontWeight,
        color,
        ...style,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  style,
  onClick,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.default,
    outline: 'none',
    gap: '8px',
    boxShadow: theme.shadows.md,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 0,
  };

  const variantStyles: React.CSSProperties = {
    primary: {
      backgroundColor: theme.colors.primaryBlue,
      color: theme.colors.textLight,
      border: `1px solid ${theme.colors.primaryBlue}`,
      '&:hover': { backgroundColor: '#005F99', borderColor: '#005F99' },
      '&:active': { backgroundColor: '#004C7A', borderColor: '#004C7A' },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.primaryBlue,
      border: `1px solid ${theme.colors.primaryBlue}`,
      '&:hover': { backgroundColor: 'rgba(0, 122, 204, 0.1)' },
      '&:active': { backgroundColor: 'rgba(0, 122, 204, 0.2)' },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.primaryBlue,
      border: 'none',
      boxShadow: 'none',
      '&:hover': { backgroundColor: 'rgba(0, 122, 204, 0.05)' },
      '&:active': { backgroundColor: 'rgba(0, 122, 204, 0.1)' },
    },
  }[variant];

  const sizeStyles: React.CSSProperties = {
    sm: { padding: '8px 12px', fontSize: '0.875rem' },
    md: { padding: '10px 16px', fontSize: '1rem' },
    lg: { padding: '12px 20px', fontSize: '1.125rem' },
  }[size];

  // Ripple effect (manual implementation)
  const [ripple, setRipple] = useState<{ x: number, y: number, size: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5; // Make ripple larger
      setRipple({
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size: size,
      });
      setTimeout(() => setRipple(null), 600); // Ripple duration
    }
    onClick?.(event);
  };

  return (
    <button
      ref={buttonRef}
      style={{
        ...baseStyles,
        ...variantStyles,
        ...sizeStyles,
        ...style,
      }}
      onClick={handleClick}
      {...props}
    >
      {leftIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
      {ripple && (
        <span
          style={{
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none',
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            zIndex: -1,
          }}
        />
      )}
      {/* Global CSS for ripple animation */}
      <style>{`
        @keyframes ripple {
          from { transform: scale(0); opacity: 1; }
          to { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </button>
  );
};

// --- Icons (Simple SVG Icons) ---
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
}

const HomeIcon = ({ size = '24px', ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ChartIcon = ({ size = '24px', ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20V10"></path>
    <path d="M18 20V4"></path>
    <path d="M6 20v-4"></path>
  </svg>
);

const SettingsIcon = ({ size = '24px', ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 5 19.4a1.65 1.65 0 0 0-1.82-.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 5 9.4a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a2 2 0 0 1 2-2v-.09A1.65 1.65 0 0 0 13 3a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ComponentIcon = ({ size = '24px', ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <path d="M17 2v5"></path>
    <path d="M7 2v5"></path>
  </svg>
);

const AlertCircleIcon = ({ size = '24px', ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// --- Global State Context (Mimicking Zustand) ---
interface ComponentData {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'alert';
}

interface SelectedComponentDetailedData {
  id: string;
  name: string;
  flowIn: number;
  flowOut: number;
  temp: number;
  ph: number;
  pressure: number;
  status: 'normal' | 'warning' | 'critical';
  prediction: string;
}

interface AppState {
  currentView: 'dashboard' | 'detailed';
  activeComponentId: string | null;
  data: {
    pressure: number;
    volume: number;
    purity: number;
    anomalies: number;
    flowRate: number[]; // For flow conduit animation
  };
  components: ComponentData[];
  selectedComponentData: SelectedComponentDetailedData | null;
}

type AppActions = {
  setView: (view: AppState['currentView']) => void;
  setActiveComponent: (id: string | null) => void;
  updateData: (newData: Partial<AppState['data']>) => void;
  updateSelectedComponentData: (data: Partial<SelectedComponentDetailedData>) => void;
};

const AppContext = createContext<{ state: AppState; actions: AppActions } | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentView: 'dashboard',
    activeComponentId: null,
    data: {
      pressure: 2.5,
      volume: 1200,
      purity: 99.8,
      anomalies: 0,
      flowRate: Array.from({ length: 50 }, () => 0.5 + Math.random() * 0.5),
    },
    components: [
      { id: 'pump-001', name: 'Main Pump A', type: 'Pump', status: 'online' },
      { id: 'valve-002', name: 'Valve Cluster B', type: 'Valve', status: 'online' },
      { id: 'filter-003', name: 'Carbon Filter C', type: 'Filter', status: 'alert' },
      { id: 'sensor-004', name: 'Temp Sensor D', type: 'Sensor', status: 'online' },
      { id: 'pipe-section-005', name: 'Pipe Section E', type: 'Pipe', status: 'offline' },
    ],
    selectedComponentData: null,
  });

  const actions: AppActions = {
    setView: (view) => setState((prev) => ({ ...prev, currentView: view })),
    setActiveComponent: (id) => {
      setState((prev) => {
        if (id) {
          const component = prev.components.find(c => c.id === id);
          return {
            ...prev,
            activeComponentId: id,
            selectedComponentData: {
              id: id,
              name: component?.name || id,
              flowIn: parseFloat((150 + Math.random() * 50).toFixed(1)),
              flowOut: parseFloat((145 + Math.random() * 50).toFixed(1)),
              temp: parseFloat((25 + Math.random() * 5).toFixed(1)),
              ph: parseFloat((7.0 + Math.random() * 0.2).toFixed(1)),
              pressure: parseFloat((3.2 + Math.random() * 0.5).toFixed(1)),
              status: component?.status === 'alert' ? 'warning' : 'normal',
              prediction: 'Stable performance expected for 48h.',
            },
          };
        }
        return { ...prev, activeComponentId: null, selectedComponentData: null };
      });
    },
    updateData: (newData) => setState((prev) => ({ ...prev, data: { ...prev.data, ...newData } })),
    updateSelectedComponentData: (newData) => setState((prev) => ({
      ...prev,
      selectedComponentData: prev.selectedComponentData ? { ...prev.selectedComponentData, ...newData } : null,
    })),
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        data: {
          pressure: parseFloat((2.0 + Math.random() * 1.5).toFixed(1)),
          volume: parseFloat((prev.data.volume + Math.random() * 10 - 5).toFixed(0)),
          purity: parseFloat((99.5 + Math.random() * 0.5).toFixed(1)),
          anomalies: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
          flowRate: prev.data.flowRate.slice(1).concat([0.5 + Math.random() * 0.5]),
        },
        components: prev.components.map(comp => {
          if (comp.id === 'filter-003') { // Simulate an intermittent alert
            return { ...comp, status: Math.random() > 0.8 ? 'alert' : 'online' };
          }
          if (comp.id === 'pipe-section-005') { // Simulate intermittent offline
            return { ...comp, status: Math.random() > 0.95 ? 'offline' : 'online' };
          }
          return comp;
        }),
      }));

      if (state.activeComponentId && state.selectedComponentData) {
        setState((prev) => ({
          ...prev,
          selectedComponentData: {
            ...prev.selectedComponentData!,
            flowIn: parseFloat((150 + Math.random() * 50).toFixed(1)),
            flowOut: parseFloat((145 + Math.random() * 50).toFixed(1)),
            temp: parseFloat((24 + Math.random() * 4).toFixed(1)),
            ph: parseFloat((6.9 + Math.random() * 0.3).toFixed(1)),
            pressure: parseFloat((3.0 + Math.random() * 0.7).toFixed(1)),
            status: prev.components.find(c => c.id === prev.activeComponentId)?.status === 'alert' ? 'warning' : 'normal',
          },
        }));
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [state.activeComponentId, state.selectedComponentData]); // Dependencies for selected component updates

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// --- App Shell Components ---
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <Flex
    align="center"
    justify="center"
    direction="column"
    gap="4px"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={label}
    style={{
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '8px',
      transition: theme.transitions.fast,
      color: isActive ? theme.colors.accentCyan : theme.colors.textLight,
      backgroundColor: isActive ? 'rgba(0, 188, 212, 0.15)' : 'transparent',
      boxShadow: isActive ? `0 0 10px rgba(0, 188, 212, 0.4)` : 'none',
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      flexShrink: 0,
      '&:hover': {
        color: theme.colors.accentCyan,
        backgroundColor: 'rgba(0, 188, 212, 0.08)',
      },
      '&:focus-visible': {
        outline: `2px solid ${theme.colors.accentCyan}`,
        outlineOffset: '2px',
      }
    }}
  >
    {React.cloneElement(icon as React.ReactElement, { color: isActive ? theme.colors.accentCyan : theme.colors.textLight, size: '24px' })}
    <Text fontSize="small" style={{ marginTop: '4px' }}>{label}</Text>
  </Flex>
);

const TopNavBar: React.FC = () => {
  const { state, actions } = useAppContext();
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      style={{
        width: '100%',
        padding: '16px 32px',
        backgroundColor: 'rgba(23, 25, 35, 0.8)', // Darker, slightly transparent
        backdropFilter: 'blur(10px)',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: theme.shadows.lg,
      }}
    >
      <Text fontSize="h2" color={theme.colors.accentCyan} style={{ fontWeight: 700 }}>
        HydroFlow <span style={{ color: theme.colors.textLight, fontWeight: 300 }}>Dashboard</span>
      </Text>
      <Flex gap="16px">
        <NavItem
          icon={<HomeIcon />}
          label="Overview"
          isActive={state.currentView === 'dashboard'}
          onClick={() => actions.setView('dashboard')}
        />
        <NavItem
          icon={<ChartIcon />}
          label="Components"
          isActive={state.currentView === 'detailed'}
          onClick={() => actions.setView('detailed')}
        />
        <NavItem
          icon={<SettingsIcon />}
          label="Settings"
          isActive={false}
          onClick={() => alert('Settings view not implemented in this example.')}
        />
      </Flex>
    </Flex>
  );
};

// --- Animated Background (Mimicking Framer Motion Particles/Gradients) ---
const AnimatedBackground: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [gradientShift, setGradientShift] = useState(0);

  useEffect(() => {
    const animateGradient = () => {
      setGradientShift((prev) => (prev + 0.05) % 100);
      animationFrameId = requestAnimationFrame(animateGradient);
    };

    let animationFrameId = requestAnimationFrame(animateGradient);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const pseudoStyles: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(45deg, ${theme.colors.gradientStart} ${gradientShift - 20}%, ${theme.colors.primaryBlue} ${gradientShift}%, ${theme.colors.accentCyan} ${gradientShift + 20}%)`,
    backgroundSize: '300% 300%',
    filter: 'blur(100px) opacity(0.3)',
    animation: 'gradientShift 60s ease infinite',
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.gray[900],
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      <div style={pseudoStyles} />
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="bubble-particle" // Use class to target with JS
          style={{
            position: 'absolute',
            background: `radial-gradient(circle at center, ${theme.colors.accentCyan} 0%, rgba(0,188,212,0) 70%)`,
            borderRadius: '50%',
            opacity: 0.05 + Math.random() * 0.1,
            animation: `bubble ${20 + Math.random() * 30}s linear infinite ${i * 2}s`,
            width: `${50 + Math.random() * 150}px`,
            height: `${50 + Math.random() * 150}px`,
            filter: 'blur(20px)',
            transform: 'translate(var(--rand-x-start, 0) * 100vw, var(--rand-y-start, 0) * 100vh) scale(0.5)', // Initial for animation
          }}
        />
      ))}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bubble {
          0% {
            transform: translate(calc(var(--rand-x-start, 0) * 100vw), calc(var(--rand-y-start, 0) * 100vh)) scale(0.5);
            opacity: 0;
          }
          50% { opacity: 0.1; }
          100% {
            transform: translate(calc(var(--rand-x-end, 1) * 100vw), calc(var(--rand-y-end, 1) * 100vh)) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
      {/* Inject CSS variables for bubble animation via JS for randomness */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
          const bubbles = document.querySelectorAll('.bubble-particle');
          bubbles.forEach(bubble => {
            bubble.style.setProperty('--rand-x-start', (Math.random() * 1.2 - 0.1).toFixed(2));
            bubble.style.setProperty('--rand-y-start', (Math.random() * 1.2 - 0.1).toFixed(2));
            bubble.style.setProperty('--rand-x-end', (Math.random() * 1.2 - 0.1).toFixed(2));
            bubble.style.setProperty('--rand-y-end', (Math.random() * 1.2 - 0.1).toFixed(2));
          });
        });
      `}} />
    </div>
  );
};


// --- Dashboard - Flow Overview ---
interface DataDropletProps {
  label: string;
  value: string | number;
  unit: string;
  icon?: React.ReactNode;
  delay?: number;
  isAnomaly?: boolean;
}

const DataDroplet: React.FC<DataDropletProps> = ({ label, value, unit, icon, delay = 0, isAnomaly = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{
        backgroundColor: theme.colors.surfaceDark,
        borderRadius: '16px',
        padding: '20px',
        minWidth: '160px',
        minHeight: '120px',
        boxShadow: theme.shadows.lg,
        border: `1px solid ${isAnomaly ? theme.colors.brandRed : (isHovered ? theme.colors.accentCyan : 'rgba(0,188,212,0.3)')}`,
        transform: `translateY(${isVisible ? '0' : '20px'}) scale(${isVisible ? '1' : '0.9'})`,
        opacity: isVisible ? 1 : 0,
        transition: `${theme.transitions.default}, border 0.2s ease-in-out`,
        position: 'relative',
        overflow: 'hidden',
        color: theme.colors.textLight,
        cursor: 'default',
        transformOrigin: 'center center',
        animation: isAnomaly ? 'pulseRed 1.5s infinite' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && React.cloneElement(icon as React.ReactElement, { color: isAnomaly ? theme.colors.brandRed : (isHovered ? theme.colors.accentCyan : theme.colors.primaryBlue), size: '32px' })}
      <Text fontSize="small" style={{ marginTop: '8px', color: theme.colors.gray[200] }}>{label}</Text>
      <Flex align="baseline" style={{ marginTop: '4px', color: isAnomaly ? theme.colors.brandRed : (isHovered ? theme.colors.accentCyan : theme.colors.textLight) }}>
        <Text fontSize="h2" fontWeight={700}>{value}</Text>
        <Text fontSize="small" style={{ marginLeft: '4px' }}>{unit}</Text>
      </Flex>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${theme.colors.accentCyan} 0%, transparent 70%)`,
          opacity: isHovered ? 0.1 : 0,
          transition: theme.transitions.fast,
          pointerEvents: 'none',
        }}
      />
      <style>{`
        @keyframes pulseRed {
          0% { box-shadow: 0 0 15px ${theme.colors.brandRed}; }
          50% { box-shadow: 0 0 25px ${theme.colors.brandRed}; }
          100% { box-shadow: 0 0 15px ${theme.colors.brandRed}; }
        }
      `}</style>
    </Flex>
  );
};

// SVG for Flow Conduit (Mimicking D3.js + Framer Motion)
const FlowConduitVisualization: React.FC<{ flowRateData: number[] }> = ({ flowRateData }) => {
  const width = 800;
  const height = 400;
  const pathData = `M 0 200 C ${width / 4} 100, ${width / 4 * 3} 300, ${width} 200`;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const animateFlow = () => {
      setOffset((prev) => (prev + 0.5) % 100);
      animationFrameId = requestAnimationFrame(animateFlow);
    };
    let animationFrameId = requestAnimationFrame(animateFlow);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Box style={{ position: 'relative', width, height, margin: 'auto' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background conduit */}
        <path
          d={pathData}
          fill="none"
          stroke={theme.colors.primaryBlue}
          strokeWidth="60"
          strokeLinecap="round"
          opacity="0.2"
        />
        {/* Animated flow */}
        <path
          d={pathData}
          fill="none"
          stroke={`url(#flowGradient)`}
          strokeWidth="50"
          strokeLinecap="round"
          strokeDasharray="10 20"
          strokeDashoffset={-offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />

        {/* Gradient definition for the flow */}
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.colors.accentCyan} />
            <stop offset="50%" stopColor={theme.colors.primaryBlue} />
            <stop offset="100%" stopColor={theme.colors.accentCyan} />
          </linearGradient>
        </defs>

        {/* Data points along the flow path */}
        {flowRateData.map((rate, i) => {
          const progress = i / flowRateData.length;
          const pointX = width * progress;
          let pointY = 200 + (Math.sin(progress * Math.PI * 2) * 50 * (rate - 0.5)); // More dynamic wave effect

          return (
            <circle
              key={i}
              cx={pointX}
              cy={pointY}
              r={3 + rate * 2}
              fill={theme.colors.accentCyan}
              opacity={0.7 + rate * 0.3}
              style={{
                transition: 'all 0.5s ease-out',
                filter: `drop-shadow(0 0 5px ${theme.colors.accentCyan})`,
                animation: `pulseCyan 2s infinite ease-in-out ${i * 0.1}s`,
              }}
            >
              <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>
      <style>{`
        @keyframes pulseCyan {
          0% { filter: drop-shadow(0 0 5px ${theme.colors.accentCyan}); }
          50% { filter: drop-shadow(0 0 10px ${theme.colors.accentCyan}); }
          100% { filter: drop-shadow(0 0 5px ${theme.colors.accentCyan}); }
        }
      `}</style>
    </Box>
  );
};


const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Flex
      direction="column"
      align="center"
      gap="40px"
      style={{
        width: '100%',
        flex: 1,
        padding: '120px 40px 40px',
        transform: `translateY(${isVisible ? '0' : '20px'})`,
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
        color: theme.colors.textLight,
      }}
    >
      <Text fontSize="h1" style={{ color: theme.colors.accentCyan, textShadow: '0 0 15px rgba(0, 188, 212, 0.5)' }}>
        System Flow Overview
      </Text>

      <FlowConduitVisualization flowRateData={state.data.flowRate} />

      <Flex wrap="wrap" justify="center" gap="24px" style={{ maxWidth: '1200px', width: '100%' }}>
        <DataDroplet
          label="Pressure"
          value={state.data.pressure.toFixed(1)}
          unit="Bar"
          icon={<AlertCircleIcon />}
          delay={100}
        />
        <DataDroplet
          label="Volume"
          value={state.data.volume.toFixed(0)}
          unit="L/min"
          icon={<HomeIcon />}
          delay={200}
        />
        <DataDroplet
          label="Purity"
          value={state.data.purity.toFixed(1)}
          unit="%"
          icon={<ChartIcon />}
          delay={300}
        />
        <DataDroplet
          label="Anomalies"
          value={state.data.anomalies}
          unit=""
          icon={<AlertCircleIcon />}
          isAnomaly={state.data.anomalies > 0}
          delay={400}
        />
      </Flex>

      {/* Simplified Timeline/Scrubber */}
      <Flex direction="column" align="center" style={{ width: '80%', marginTop: '40px' }}>
        <Text fontSize="small" color={theme.colors.gray[300]} style={{ marginBottom: '12px' }}>
          Historical Data Scrubber
        </Text>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="70"
          aria-label="Historical data scrubber"
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: `linear-gradient(to right, ${theme.colors.accentCyan}, ${theme.colors.primaryBlue})`,
            outline: 'none',
            opacity: 0.8,
            transition: 'opacity 0.2s',
            WebkitAppearance: 'none',
            appearance: 'none',
            '::-webkit-slider-thumb': {
              WebkitAppearance: 'none',
              appearance: 'none',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: theme.colors.accentCyan,
              cursor: 'pointer',
              boxShadow: `0 0 0 4px rgba(0, 188, 212, 0.4)`,
              transition: 'background 0.3s ease-in-out',
            },
            '::-moz-range-thumb': {
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: theme.colors.accentCyan,
              cursor: 'pointer',
              boxShadow: `0 0 0 4px rgba(0, 188, 212, 0.4)`,
              transition: 'background 0.3s ease-in-out',
            },
          } as React.CSSProperties} // Cast to CSSProperties to allow vendor prefixes
        />
      </Flex>
    </Flex>
  );
};

// --- Detailed View - System Component Analysis ---
interface SystemMapItemProps {
  component: ComponentData;
  isActive: boolean;
  onClick: (id: string) => void;
}

const SystemMapItem: React.FC<SystemMapItemProps> = ({ component, isActive, onClick }) => {
  const statusColor = {
    online: theme.colors.accentCyan,
    alert: theme.colors.brandRed,
    offline: theme.colors.gray[500],
  }[component.status];

  return (
    <Flex
      align="center"
      gap="12px"
      onClick={() => onClick(component.id)}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`Select ${component.name}`}
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isActive ? 'rgba(0, 188, 212, 0.2)' : 'transparent',
        borderLeft: `4px solid ${isActive ? theme.colors.accentCyan : 'transparent'}`,
        transition: theme.transitions.fast,
        color: theme.colors.textLight,
        '&:hover': {
          backgroundColor: 'rgba(0, 188, 212, 0.1)',
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.colors.accentCyan}`,
          outlineOffset: '2px',
        }
      }}
    >
      {React.cloneElement(<ComponentIcon />, { size: '20px', color: statusColor })}
      <Box style={{ flexGrow: 1 }}>
        <Text fontSize="body" fontWeight={isActive ? 600 : 400}>{component.name}</Text>
        <Text fontSize="small" color={theme.colors.gray[400]}>{component.type}</Text>
      </Box>
      <Box
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor,
          boxShadow: `0 0 8px ${statusColor}`,
          animation: component.status === 'alert' ? 'pulseRedSmall 1.5s infinite' : 'none',
        }}
      />
      <style>{`
        @keyframes pulseRedSmall {
          0% { box-shadow: 0 0 5px ${theme.colors.brandRed}; }
          50% { box-shadow: 0 0 10px ${theme.colors.brandRed}; }
          100% { box-shadow: 0 0 5px ${theme.colors.brandRed}; }
        }
      `}</style>
    </Flex>
  );
};

// Mimicking 3D model/Advanced Schematic (SVG with fluid data panels)
const ComponentSchematic: React.FC<{ componentData: SelectedComponentDetailedData | null }> = ({ componentData }) => {
  const { state } = useAppContext();
  if (!componentData) {
    return (
      <Flex align="center" justify="center" style={{ flex: 1, color: theme.colors.gray[500] }}>
        <Text fontSize="h3">Select a component to view details</Text>
      </Flex>
    );
  }

  const statusColor = {
    normal: theme.colors.accentCyan,
    warning: theme.colors.brandRed,
    critical: theme.colors.brandRed,
  }[componentData.status];

  return (
    <Flex direction="column" gap="24px" style={{ flex: 1, padding: '24px', position: 'relative' }}>
      <Flex justify="space-between" align="center">
        <Text fontSize="h2" color={theme.colors.accentCyan} style={{ textShadow: '0 0 10px rgba(0, 188, 212, 0.3)' }}>
          {componentData.name} Analysis
        </Text>
        <Box style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: statusColor }}>
          {componentData.status === 'warning' || componentData.status === 'critical' ? (
            <AlertCircleIcon size="24px" />
          ) : (
            <ComponentIcon size="24px" />
          )}
          <Text fontSize="h3" fontWeight={600}>{componentData.status.toUpperCase()}</Text>
        </Box>
      </Flex>

      {/* SVG Schematic - simplified isometric pipes/nodes */}
      <Box
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '16px',
          padding: '20px',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: theme.shadows.lg,
          border: `1px solid rgba(0, 188, 212, 0.2)`,
        }}
      >
        <svg viewBox="0 0 600 300" width="100%" height="100%" aria-label="System schematic visualization">
          {/* Isometric background grid */}
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 L 0 10" fill="none" stroke="rgba(0,188,212,0.05)" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 L 0 100" fill="none" stroke="rgba(0,188,212,0.1)" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Main pipe path */}
          <path
            d="M50,150 L200,150 L250,100 L400,100 L450,150 L550,150"
            fill="none"
            stroke={theme.colors.primaryBlue}
            strokeWidth="30"
            strokeLinecap="round"
            opacity="0.3"
            aria-label="Main pipe conduit"
          />
          {/* Animated inner flow */}
          <path
            d="M50,150 L200,150 L250,100 L400,100 L450,150 L550,150"
            fill="none"
            stroke={`url(#detailedFlowGradient)`}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="10 20"
            strokeDashoffset={-state.data.flowRate[0] * 50}
            style={{ animation: 'flowPath 2s linear infinite' }}
            aria-label="Animated fluid flow"
          />

          {/* Gradient for detailed flow */}
          <defs>
            <linearGradient id="detailedFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.colors.accentCyan} />
              <stop offset="100%" stopColor={theme.colors.primaryBlue} />
            </linearGradient>
          </defs>

          {/* Component visualization (e.g., a pump icon) */}
          <circle cx="200" cy="150" r="40" fill="rgba(0,188,212,0.1)" stroke={theme.colors.accentCyan} strokeWidth="2" aria-label={`Component: ${componentData.name}`} />
          <text x="200" y="155" textAnchor="middle" fill={theme.colors.textLight} fontSize="20" style={{ pointerEvents: 'none' }}>
            <tspan>{componentData.name.split(' ')[0]}</tspan>
          </text>

          {/* Sensor node */}
          <circle cx="400" cy="100" r="15" fill={statusColor} stroke="white" strokeWidth="2" style={{ animation: componentData.status !== 'normal' ? 'pulseRedSmall 1.5s infinite' : 'none' }} aria-label="Sensor location" />
          <text x="400" y="80" textAnchor="middle" fill={theme.colors.textLight} fontSize="12">Sensor</text>

          {/* Labels for flow */}
          <text x="120" y="180" textAnchor="middle" fill={theme.colors.accentCyan} fontSize="14">Flow In: {componentData.flowIn} L/min</text>
          <text x="480" y="180" textAnchor="middle" fill={theme.colors.primaryBlue} fontSize="14">Flow Out: {componentData.flowOut} L/min</text>
        </svg>
        <style>{`
          @keyframes flowPath {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -30; }
          }
        `}</style>
      </Box>

      {/* Fluid Data Panels */}
      <Flex wrap="wrap" justify="space-around" gap="20px" style={{ width: '100%', marginTop: '20px' }}>
        <FluidDataPanel label="Temperature" value={`${componentData.temp.toFixed(1)} °C`} status={componentData.status} />
        <FluidDataPanel label="pH Level" value={componentData.ph.toFixed(1)} status={componentData.status} />
        <FluidDataPanel label="Pressure" value={`${componentData.pressure.toFixed(1)} Bar`} status={componentData.status} />
        <FluidDataPanel label="Predictive" value={componentData.prediction} status={componentData.status} />
      </Flex>

      {/* Contextual Action Buttons */}
      <Flex justify="center" gap="24px" style={{ marginTop: '30px' }}>
        <Button leftIcon={<SettingsIcon />} variant="primary">Adjust Settings</Button>
        <Button leftIcon={<AlertCircleIcon />} variant="secondary">Report Anomaly</Button>
      </Flex>
    </Flex>
  );
};

interface FluidDataPanelProps {
  label: string;
  value: string | number;
  status: 'normal' | 'warning' | 'critical';
}

const FluidDataPanel: React.FC<FluidDataPanelProps> = ({ label, value, status }) => {
  const statusColor = {
    normal: theme.colors.accentCyan,
    warning: theme.colors.brandRed,
    critical: theme.colors.brandRed,
  }[status];

  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    const targetHeight = status === 'critical' ? 90 : (status === 'warning' ? 60 : 30);
    setFillHeight(targetHeight);
  }, [status]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      style={{
        backgroundColor: theme.colors.surfaceDark,
        borderRadius: '16px',
        padding: '16px',
        width: '200px',
        height: '150px',
        boxShadow: theme.shadows.lg,
        border: `1px solid ${statusColor}`,
        position: 'relative',
        overflow: 'hidden',
        color: theme.colors.textLight,
        transition: theme.transitions.default,
      }}
    >
      <Text fontSize="small" color={theme.colors.gray[200]}>{label}</Text>
      <Text fontSize="h3" fontWeight={700} color={statusColor} style={{ zIndex: 1 }}>{value}</Text>
      <Box
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${fillHeight}%`,
          backgroundColor: status === 'critical' ? 'rgba(229, 62, 62, 0.2)' : (status === 'warning' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0, 188, 212, 0.1)'),
          transition: 'height 1s ease-out',
          borderRadius: '0 0 16px 16px',
        }}
      />
    </Flex>
  );
};


const DetailedView: React.FC = () => {
  const { state, actions } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Set first component as active by default if none is selected on initial load
    if (!state.activeComponentId && state.components.length > 0) {
      actions.setActiveComponent(state.components[0].id);
    }
  }, [state.activeComponentId, state.components.length, actions]);

  return (
    <Flex
      style={{
        width: '100%',
        flex: 1,
        paddingTop: '80px',
        transform: `translateX(${isVisible ? '0' : '20px'})`,
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
        color: theme.colors.textLight,
      }}
    >
      {/* Left Sidebar - System Map */}
      <Flex
        direction="column"
        style={{
          width: '300px',
          padding: '32px 16px',
          backgroundColor: 'rgba(26, 32, 44, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRight: `1px solid ${theme.colors.gray[700]}`,
          boxShadow: theme.shadows.lg,
          flexShrink: 0,
        }}
      >
        <Text fontSize="h3" color={theme.colors.accentCyan} style={{ marginBottom: '24px', textShadow: '0 0 10px rgba(0, 188, 212, 0.2)' }}>
          System Map
        </Text>
        <Flex direction="column" gap="8px">
          {state.components.map((comp) => (
            <SystemMapItem
              key={comp.id}
              component={comp}
              isActive={state.activeComponentId === comp.id}
              onClick={actions.setActiveComponent}
            />
          ))}
        </Flex>
      </Flex>

      {/* Main Content Area - Component Schematic */}
      <Flex direction="column" style={{ flex: 1, padding: '32px' }}>
        <ComponentSchematic componentData={state.selectedComponentData} />
      </Flex>
    </Flex>
  );
};


// --- Main Application Component ---
const GeneratedUI: React.FC = () => {
  const { state } = useAppContext();
  const [isAppMounted, setIsAppMounted] = useState(false);

  useEffect(() => {
    setIsAppMounted(true);
  }, []);

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: theme.typography.fontFamily,
        position: 'relative',
        backgroundColor: theme.colors.gray[900],
        overflow: 'hidden',
        color: theme.colors.textLight,
      }}
    >
      <AnimatedBackground />
      <TopNavBar />
      <Box
        style={{
          flex: 1,
          display: 'flex',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          transition: 'opacity 0.8s ease-out',
          opacity: isAppMounted ? 1 : 0,
        }}
      >
        {state.currentView === 'dashboard' ? <Dashboard /> : <DetailedView />}
      </Box>
    </Box>
  );
};

// Wrapper component to provide the AppContext
const AppWrapper: React.FC = () => (
  <AppProvider>
    <GeneratedUI />
  </AppProvider>
);

export default AppWrapper;
