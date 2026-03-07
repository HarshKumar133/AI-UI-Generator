import { motion } from "framer-motion";

export function WireframeGrid({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="currentColor" strokeWidth="0.1"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export function NodeGraph({ className }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg width="400" height="300" viewBox="0 0 400 300" fill="none" className="opacity-10">
        <motion.circle 
          cx="50" cy="50" r="4" fill="currentColor" 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle 
          cx="150" cy="100" r="4" fill="currentColor"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.circle 
          cx="100" cy="200" r="4" fill="currentColor"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
        <motion.circle 
          cx="300" cy="150" r="6" fill="currentColor"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <path d="M50 50 L150 100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M150 100 L100 200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M150 100 L300 150" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function CodeWindow({ className }: { className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
      </div>
      <div className="p-4 font-mono text-[10px] leading-relaxed text-white/40">
        <div className="text-brand-red">export const</div> <span className="text-blue-400">App</span> = () =&gt; &#123;
        <div className="pl-4">
          <span className="text-brand-red">return</span> (
          <div className="pl-4">
            &lt;<span className="text-blue-400">Showcase</span> /&gt;
          </div>
          );
        </div>
        &#125;;
      </div>
    </motion.div>
  );
}
