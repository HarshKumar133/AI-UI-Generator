import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20 / speed, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-white/20 to-transparent rounded-full blur-3xl"
        />
        <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 w-full h-full">
        {renderArt()}
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-black/5 opacity-50" />
    </div>
  );
}

// --- VARIANT COMPONENTS ---

function GridArt({ palette, speed }: { palette: any, speed: number }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-12">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3 / speed, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-yellow-400/40 blur-2xl rounded-full"
        />
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="relative p-4 rounded-full bg-white/10 backdrop-blur-sm shadow-xl"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={palette.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2v1" /><path d="m5.22 5.22.71.71" /><path d="m18.07 5.22-.71.71" /><path d="M12 6a7 7 0 0 0-7 7c0 2.5 2 4.5 4.5 4.5h5c2.5 0 4.5-2 4.5-4.5a7 7 0 0 0-7-7z" />
          </svg>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.1, y: -5 }}
            style={{ backgroundColor: i % 2 === 0 ? palette.primary : palette.secondary }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border-2 border-black/5 transition-colors cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}

function NodesArt({ palette, speed }: { palette: any, speed: number }) {
  const nodes = [
    { x: "20%", y: "30%", color: palette.primary },
    { x: "50%", y: "20%", color: palette.secondary },
    { x: "80%", y: "35%", color: palette.primary },
    { x: "30%", y: "60%", color: palette.secondary },
    { x: "70%", y: "70%", color: palette.accent },
    { x: "50%", y: "50%", color: "#fff" },
  ];

  return (
    <div className="w-full h-full relative p-12">
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        {/* Connection Lines */}
        <motion.path
          d="M 20 30 Q 50 20 80 35 T 70 70 T 30 60 Z"
          fill="none"
          stroke={palette.primary}
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, strokeDashoffset: [0, -20] }}
          transition={{ pathLength: { duration: 2 }, strokeDashoffset: { duration: 10 / speed, repeat: Infinity, ease: "linear" } }}
          className="opacity-40"
        />
        <motion.path
          d="M 50 50 L 20 30 M 50 50 L 50 20 M 50 50 L 80 35 M 50 50 L 30 60 M 50 50 L 70 70"
          fill="none"
          stroke={palette.secondary}
          strokeWidth="0.5"
          className="opacity-20"
        />
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{ 
            scale: { delay: i * 0.1, type: "spring" },
            y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ 
            left: node.x, 
            top: node.y, 
            backgroundColor: node.color,
            boxShadow: `0 0 20px ${node.color}44`
          }}
          className="absolute w-6 h-6 rounded-full border-2 border-white/20 z-20"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ backgroundColor: node.color }}
            className="absolute inset-0 rounded-full blur-md"
          />
        </motion.div>
      ))}
    </div>
  );
}

function OrbitArt({ palette, speed }: { palette: any, speed: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Concentric Rings */}
        {[1, 2, 3].map((r) => (
          <motion.div
            key={r}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{ 
              opacity: { duration: 1 },
              scale: { duration: 1 },
              rotate: { duration: (10 + r * 5) / speed, repeat: Infinity, ease: "linear" }
            }}
            style={{ 
              border: `1px dashed ${r === 2 ? palette.secondary : palette.primary}44`,
              padding: `${r * 40}px`
            }}
            className="absolute inset-0 rounded-full flex items-center justify-center"
          >
            <motion.div 
              style={{ backgroundColor: r === 2 ? palette.secondary : palette.primary }}
              className="w-3 h-3 rounded-full absolute top-0 left-1/2 -translate-x-1/2"
            />
          </motion.div>
        ))}

        {/* Center Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [`0 0 20px ${palette.accent}22`, `0 0 40px ${palette.accent}44`, `0 0 20px ${palette.accent}22`]
            }}
            transition={{ duration: 3 / speed, repeat: Infinity }}
            style={{ backgroundColor: palette.accent }}
            className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21 16-4-4 4-4" /><path d="M17 12H3" /><path d="m3 8 4 4-4 4" />
            </svg>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5 / speed, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10px] border border-white/20 rounded-[2.5rem]"
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
      <div className="relative w-full h-full max-w-sm">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={palette.primary} />
              <stop offset="100%" stopColor={palette.accent} />
            </linearGradient>
          </defs>
          <motion.path
            d="M 20 100 C 50 100 50 50 100 50 C 150 50 150 150 180 150"
            fill="none"
            stroke="url(#flow-grad)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <motion.path
            d="M 20 100 C 50 100 50 50 100 50 C 150 50 150 150 180 150"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 20"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 5 / speed, repeat: Infinity, ease: "linear" }}
            className="opacity-40"
          />
        </svg>

        {/* Pulse elements */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ 
              duration: 3 / speed, 
              repeat: Infinity, 
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            style={{ 
              offsetPath: "path('M 20 100 C 50 100 50 50 100 50 C 150 50 150 150 180 150')",
              backgroundColor: palette.accent,
              boxShadow: `0 0 30px ${palette.accent}`
            }}
            className="absolute w-8 h-8 rounded-full border-4 border-white flex items-center justify-center"
          >
             <motion.div
               animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
               transition={{ duration: 1 }}
               className="w-full h-full bg-white/40 rounded-full"
             />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        {[1, 1.5, 2].map((s, i) => (
          <motion.div
            key={i}
            animate={{ height: [8, 24, 8] }}
            transition={{ duration: 1 / s, repeat: Infinity, delay: i * 0.1 }}
            style={{ backgroundColor: palette.primary }}
            className="w-2 rounded-full opacity-50"
          />
        ))}
      </div>
    </div>
  );
}

function SystemArt({ palette, speed }: { palette: any, speed: number }) {
  return (
    <div className="w-full h-full p-8 grid grid-cols-6 grid-rows-6 gap-2 opacity-80">
      {[...Array(36)].map((_, i) => {
        const isBig = i % 13 === 0;
        const color = i % 5 === 0 ? palette.accent : (i % 3 === 0 ? palette.primary : palette.secondary);
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className={cn(
              "rounded-lg border border-white/10 flex items-center justify-center overflow-hidden",
              isBig ? "col-span-2 row-span-2 bg-white/10 backdrop-blur-md" : "bg-white/5",
              "hover:bg-white/20 transition-colors cursor-crosshair"
            )}
          >
            {isBig ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10 / speed, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-t-2 border-r-2 rounded-full"
                style={{ borderColor: color }}
              />
            ) : (
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: color }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// --- MATRIX RAIN ---

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
  color = "#22c55e", // default green
  speedBase = 10,
  content = "10110010110101011000101010110110110101011001010110101",
  title = "DECRYPTION IN PROGRESS",
  subtitle = "SYSTEM ACCESS"
}: MatrixRainProps) {
  return (
    <div className={`relative w-full h-full bg-brand-dark rounded-[3rem] overflow-hidden ${className}`}>
      <div className="absolute inset-0 font-mono text-[10px] flex justify-between px-4" style={{ color: `${color}44` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
          <motion.div 
            key={col}
            animate={{ y: [-500, 500] }}
            transition={{ duration: speedBase + col * 2, repeat: Infinity, ease: "linear" }}
            className="flex flex-col whitespace-pre"
          >
             {content.split("").join("\n")}
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark" />
      <div className="absolute inset-0 flex items-center justify-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="p-8 md:p-12 border-2 rounded-3xl bg-brand-dark/80 backdrop-blur-xl text-center"
           style={{ borderColor: `${color}44` }}
         >
            <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60" style={{ color }}>{subtitle}</div>
            <div className="text-2xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter">
              {title.split(" ").map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </div>
            
            {/* Scanned line decoration */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-0 right-0 h-px w-full pointer-events-none"
              style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
            />
         </motion.div>
      </div>
    </div>
  );
}

// Utility to combine classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
