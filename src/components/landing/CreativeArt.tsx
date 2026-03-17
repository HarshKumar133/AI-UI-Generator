import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";

export type ArtVariant = "grid" | "nodes" | "orbit" | "flow" | "system";

interface CreativeArtProps {
  className?: string;
  variant?: ArtVariant;
  palette?: {
    primary: string;
    secondary: string;
    accent: string;
    bg?: string;
  };
  speed?: number;
  theme?: "light" | "dark";
}

const DEFAULT_PALETTE = {
  primary: "#AECBFA", // Light Blue
  secondary: "#FDE293", // Light Yellow
  accent: "#D94225", // Brand Red
};

export function CreativeIdeationArt({ 
  className, 
  variant = "grid", 
  palette = DEFAULT_PALETTE,
  speed = 1,
  theme = "light"
}: CreativeArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderArt = () => {
    switch (variant) {
      case "nodes":
        return <NodesArt palette={palette} speed={speed} />;
      case "orbit":
        return <OrbitArt palette={palette} speed={speed} />;
      case "flow":
        return <FlowArt palette={palette} speed={speed} />;
      case "system":
        return <SystemArt palette={palette} speed={speed} />;
      case "grid":
      default:
        return <GridArt palette={palette} speed={speed} />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${
        theme === "dark" ? "bg-brand-dark" : "bg-brand-cream/10"
      } ${palette.bg || ""} ${className}`}
    >
      {/* Premium Background Atmosphere */}
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 30 / speed, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 40 / speed, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-gradient-to-tl from-white/20 via-transparent to-transparent rounded-full blur-3xl"
        />
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.08]">
          <defs>
            <pattern id="subtle-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subtle-grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full h-full">
        {renderArt()}
      </div>

      {/* Premium Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-black/10 opacity-60" />
      
      {/* Radial Light Leak */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-radial-at-center from-white via-transparent to-transparent"
        />
      </div>
    </div>
  );
}

// --- PREMIUM VARIANT COMPONENTS ---

function GridArt({ palette, speed }: { palette: any, speed: number }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-12 p-6">
      {/* Premium Lightbulb */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ duration: 3.5 / speed, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-300 blur-3xl rounded-full"
          style={{ boxShadow: `0 0 60px ${palette.secondary}` }}
        />
        <motion.div
          whileHover={{ scale: 1.15, rotate: 8 }}
          className="relative p-5 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl shadow-2xl border border-white/20"
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={palette.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2v1" />
            <motion.g
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path d="m5.22 5.22.71.71" /><path d="m18.07 5.22-.71.71" />
            </motion.g>
            <path d="M12 6a7 7 0 0 0-7 7c0 2.5 2 4.5 4.5 4.5h5c2.5 0 4.5-2 4.5-4.5a7 7 0 0 0-7-7z" />
            <motion.path
              d="M12 10v4M10 12h4"
              strokeWidth="2"
              className="opacity-50"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 1.5 / speed, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Premium Grid with Stagger Animation */}
      <div className="grid grid-cols-4 gap-5 p-10 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-lg rounded-[2.5rem] border border-white/15 shadow-2xl">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.6, opacity: 0, rotateZ: -20 }}
            whileInView={{ scale: 1, opacity: 1, rotateZ: 0 }}
            transition={{
              delay: i * 0.08,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
              damping: 12
            }}
            whileHover={{
              scale: 1.15,
              y: -8,
              boxShadow: `0 20px 40px ${palette[i % 2 === 0 ? "primary" : "secondary"]}44`,
              transition: { duration: 0.3 }
            }}
            style={{
              backgroundColor: i % 2 === 0 ? palette.primary : palette.secondary,
              boxShadow: `inset 0 1px 3px rgba(255,255,255,0.3), 0 10px 30px ${i % 2 === 0 ? palette.primary : palette.secondary}22`
            }}
            className="w-14 h-14 md:w-20 md:h-20 rounded-2xl border border-white/20 transition-all cursor-pointer group"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0.5 border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NodesArt({ palette, speed }: { palette: any, speed: number }) {
  const nodes = useMemo(() => [
    { x: 18, y: 25, color: palette.primary, size: 8, label: "A" },
    { x: 50, y: 15, color: palette.secondary, size: 10, label: "B" },
    { x: 82, y: 28, color: palette.primary, size: 8, label: "C" },
    { x: 28, y: 60, color: palette.secondary, size: 9, label: "D" },
    { x: 72, y: 70, color: palette.accent, size: 11, label: "E" },
    { x: 50, y: 50, color: "#fff", size: 12, label: "HUB" },
  ], [palette]);

  return (
    <div className="w-full h-full relative p-8 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="flow-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.primary} />
            <stop offset="100%" stopColor={palette.secondary} />
          </linearGradient>
        </defs>

        {/* Primary Connections */}
        {[[0, 5], [1, 5], [2, 5], [3, 5], [4, 5]].map((conn, idx) => (
          <motion.path
            key={`line-${idx}`}
            d={`M ${nodes[conn[0]].x} ${nodes[conn[0]].y} Q ${50} ${50} ${nodes[conn[1]].x} ${nodes[conn[1]].y}`}
            fill="none"
            stroke="url(#flow-line)"
            strokeWidth="1.5"
            opacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}

        {/* Animated Flow */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx="50"
            cy="50"
            r="2"
            fill={palette.accent}
            initial={{ cx: 50, cy: 50, r: 1, opacity: 1 }}
            animate={{
              cx: nodes[Math.floor(Math.random() * (nodes.length - 1))].x,
              cy: nodes[Math.floor(Math.random() * (nodes.length - 1))].y,
              opacity: [1, 0.5, 0]
            }}
            transition={{ duration: 3 / speed, repeat: Infinity, delay: i * 1 }}
            filter="url(#node-glow)"
          />
        ))}
      </svg>

      {/* Node Elements */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.12, type: "spring", stiffness: 200 }}
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            backgroundColor: node.color,
            boxShadow: `0 0 30px ${node.color}77, inset 0 1px 2px rgba(255,255,255,0.5)`,
            width: `${node.size}px`,
            height: `${node.size}px`
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30 z-20 cursor-pointer"
          whileHover={{ 
            scale: 1.4,
            boxShadow: `0 0 50px ${node.color}ff`,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5 / speed, repeat: Infinity }}
            style={{ 
              backgroundColor: node.color,
              boxShadow: `0 0 20px ${node.color}`
            }}
            className="absolute inset-0 rounded-full blur-md"
          />
        </motion.div>
      ))}
    </div>
  );
}

function OrbitArt({ palette, speed }: { palette: any, speed: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative p-8">
      <div className="relative w-72 h-72 md:w-96 md:h-96">
        {/* Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8 / speed, repeat: Infinity }}
          style={{ backgroundColor: palette.accent, boxShadow: `0 0 100px ${palette.accent}44` }}
          className="absolute inset-0 rounded-full blur-3xl"
        />

        {/* Orbital Rings with Premium Effects */}
        {[
          { duration: 15 / speed, size: 240, strokeDash: "8 4", opacity: 0.5 },
          { duration: 20 / speed, size: 160, strokeDash: "6 4", opacity: 0.4 },
          { duration: 25 / speed, size: 80, strokeDash: "4 3", opacity: 0.3 }
        ].map((ring, r) => (
          <motion.div
            key={`ring-${r}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: ring.opacity, scale: 1, rotate: 360 }}
            transition={{ 
              opacity: { duration: 1 },
              scale: { duration: 1 },
              rotate: { duration: ring.duration, repeat: Infinity, ease: "linear" }
            }}
            style={{
              border: `1.5px dashed ${r === 1 ? palette.secondary : r === 2 ? palette.primary : palette.accent}`,
              opacity: 0.6,
              padding: `${ring.size / 2}px`
            }}
            className="absolute inset-0 rounded-full"
          >
            {/* Orbital Particles */}
            {[0, 1, 2].map((p) => (
              <div
                key={`particle-${r}-${p}`}
                style={{
                  width: `${4 + r}px`,
                  height: `${4 + r}px`,
                  backgroundColor: [palette.primary, palette.secondary, palette.accent][p % 3],
                  boxShadow: `0 0 15px ${[palette.primary, palette.secondary, palette.accent][p % 3]}`,
                  position: "absolute",
                  top: "0",
                  left: "50%",
                  transform: `translateX(-50%) rotate(${p * 120}deg) translateY(-${ring.size / 2}px)`
                }}
                className="rounded-full"
              />
            ))}
          </motion.div>
        ))}

        {/* Animated Center Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              boxShadow: [
                `0 0 30px ${palette.accent}44`,
                `0 0 60px ${palette.accent}88`,
                `0 0 30px ${palette.accent}44`
              ]
            }}
            transition={{ duration: 3 / speed, repeat: Infinity }}
            style={{ backgroundColor: palette.accent }}
            className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden border border-white/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6 / speed, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-2 border-transparent border-t-white border-r-white rounded-full opacity-30"
            />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute">
              <path d="m21 16-4-4 4-4" /><path d="M17 12H3" /><path d="m3 8 4 4-4 4" />
            </svg>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8 / speed, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-12px] border-2 border-white/10 rounded-[3rem]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FlowArt({ palette, speed }: { palette: any, speed: number }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12">
      <div className="relative w-full h-full max-w-md flex items-center justify-center">
        <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="flow-premium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={palette.primary} />
              <stop offset="50%" stopColor={palette.secondary} />
              <stop offset="100%" stopColor={palette.accent} />
            </linearGradient>
            <filter id="flow-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
          </defs>

          {/* Main Flow Path with Stroke Animation */}
          <motion.path
            d="M 30 120 C 60 120 60 60 120 60 C 180 60 180 180 210 180"
            fill="none"
            stroke="url(#flow-premium)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            filter="url(#flow-blur)"
          />

          {/* Gradient Overlay for Depth */}
          <motion.path
            d="M 30 120 C 60 120 60 60 120 60 C 180 60 180 180 210 180"
            fill="none"
            stroke={palette.accent}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="20 20"
            animate={{ strokeDashoffset: [-40, 0] }}
            transition={{ duration: 2 / speed, repeat: Infinity, ease: "linear" }}
            opacity="0.6"
          />
        </svg>

        {/* Flowing Particles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ offsetDistance: "-10%" }}
            animate={{ offsetDistance: "110%" }}
            transition={{ 
              duration: 4 / speed,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            style={{ 
              offsetPath: "path('M 30 120 C 60 120 60 60 120 60 C 180 60 180 180 210 180')",
              backgroundColor: [palette.primary, palette.secondary, palette.accent, palette.primary][i % 4],
              boxShadow: `0 0 25px ${[palette.primary, palette.secondary, palette.accent, palette.primary][i % 4]}`
            }}
            className="absolute w-10 h-10 rounded-full border-3 border-white/40 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5 / speed }}
              className="w-full h-full bg-white/20 rounded-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Velocity Indicator Bars */}
      <motion.div className="mt-10 flex gap-3 items-end">
        {[1, 1.5, 2, 1.3].map((s, i) => (
          <motion.div
            key={i}
            animate={{ height: ["20px", "40px", "20px"] }}
            transition={{ duration: 0.8 / s, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
            style={{ 
              backgroundColor: [palette.primary, palette.secondary, palette.accent, palette.primary][i % 4],
              boxShadow: `0 0 15px ${[palette.primary, palette.secondary, palette.accent, palette.primary][i % 4]}`
            }}
            className="w-3 rounded-full opacity-70"
          />
        ))}
      </motion.div>
    </div>
  );
}

function SystemArt({ palette, speed }: { palette: any, speed: number }) {
  const gridItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < 36; i++) {
      const isCoreNode = i === 17 || i === 12 || i === 22; // Strategic positions
      const color = isCoreNode ? palette.accent : (i % 5 === 0 ? palette.primary : i % 3 === 0 ? palette.secondary : "#fff");
      items.push({ id: i, isCoreNode, color });
    }
    return items;
  }, [palette]);

  return (
    <div className="w-full h-full p-6 grid grid-cols-6 grid-rows-6 gap-3 opacity-90">
      {gridItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.4, rotateZ: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ 
            delay: item.id * 0.02,
            duration: 0.6,
            type: "spring",
            stiffness: 150
          }}
          whileHover={{
            scale: 1.2,
            boxShadow: `0 0 40px ${item.color}66`,
            transition: { duration: 0.2 }
          }}
          className={cn(
            "rounded-xl border transition-all cursor-crosshair group relative overflow-hidden",
            item.isCoreNode ? "col-span-2 row-span-2 bg-white/15 backdrop-blur-lg border-white/30 shadow-xl" : "bg-white/8 border-white/15 hover:bg-white/12"
          )}
        >
          {/* Interactive Element */}
          {item.isCoreNode ? (
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 8 / speed, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 rounded-full border-transparent"
                style={{ 
                  borderTopColor: item.color,
                  borderRightColor: item.color,
                  boxShadow: `0 0 20px ${item.color}44`
                }}
              />
            </div>
          ) : (
            <div 
              className="absolute inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ 
                backgroundColor: item.color,
                boxShadow: `inset 0 0 15px ${item.color}44`
              }}
            />
          )}

          {/* Glow Dot */}
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundColor: item.color }}
            className="absolute w-1.5 h-1.5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>
      ))}
    </div>
  );
}

// --- PREMIUM MATRIX RAIN ---

interface MatrixRainProps {
  className?: string;
  color?: string;
  speedBase?: number;
  content?: string;
  title?: string;
  subtitle?: string;
}

export function MatrixRainArt({ 
  className,
  color = "#22c55e",
  speedBase = 10,
  content = "10110010110101011000101010110110110101011001010110101",
  title = "DECRYPTION IN PROGRESS",
  subtitle = "SYSTEM ACCESS"
}: MatrixRainProps) {
  return (
    <div className={`relative w-full h-full bg-brand-dark rounded-[3rem] overflow-hidden ${className}`}>
      {/* Advanced Matrix Rain */}
      <div className="absolute inset-0 font-mono text-[9px] flex justify-between px-6 py-4" style={{ color: `${color}44` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
          <motion.div 
            key={col}
            animate={{ y: [-600, 600] }}
            transition={{ duration: speedBase + col * 2.5, repeat: Infinity, ease: "linear" }}
            className="flex flex-col whitespace-pre leading-tight"
          >
             {content.split("").map((char, i) => (
               <motion.span
                 key={i}
                 animate={{ opacity: [0.2, 0.6, 0.2] }}
                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
               >
                 {char}
               </motion.span>
             ))}
          </motion.div>
        ))}
      </div>

      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-transparent to-brand-dark pointer-events-none opacity-50" />

      {/* Center Display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.7, rotateX: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative p-10 md:p-14 border-2 rounded-3xl bg-brand-dark/90 backdrop-blur-2xl text-center"
          style={{ 
            borderColor: `${color}66`,
            boxShadow: `0 0 40px ${color}44, inset 0 0 20px ${color}11`
          }}
        >
          {/* Title with Glow */}
          <motion.div 
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[10px] font-black uppercase tracking-[0.5em] mb-4"
            style={{ color: `${color}88` }}
          >
            {subtitle}
          </motion.div>

          {/* Main Title */}
          <h3 className="text-xl md:text-3xl font-black text-white leading-tight uppercase tracking-tighter mb-3">
            {title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h3>

          {/* Animated Accent Line */}
          <motion.div
            animate={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="h-1 rounded-full mx-auto mt-4"
            style={{ backgroundColor: color }}
          />

          {/* Scan Line Effect */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 5 / speedBase, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 w-full pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${color}88, transparent)` }}
          />

          {/* Corner Accents */}
          {[0, 1, 2, 3].map((corner) => (
            <motion.div
              key={corner}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: corner * 0.25 }}
              className={`absolute w-4 h-4 border-2 ${
                corner === 0 ? "top-4 left-4 border-t border-l" :
                corner === 1 ? "top-4 right-4 border-t border-r" :
                corner === 2 ? "bottom-4 left-4 border-b border-l" :
                "bottom-4 right-4 border-b border-r"
              }`}
              style={{ borderColor: color }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Utility
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
