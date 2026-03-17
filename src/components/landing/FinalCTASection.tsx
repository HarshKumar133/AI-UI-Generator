import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { WireframeGrid } from "./WireframeDecorations";

import { CreativeIdeationArt, MatrixRainArt } from "./CreativeArt";

export function FinalCTASection() {
  return (
    <section className="py-40 bg-white relative overflow-hidden">
      <WireframeGrid className="text-brand-dark/10" />
      
      {/* Decorative blobs */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-brand-red/[0.03] blur-[120px] rounded-full -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-cream/80 blur-[150px] rounded-full -z-0" />

      <div className="section-container relative z-10 text-center">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-10 block"
        >
          FINAL CALL TO ACTION
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tight max-w-7xl mx-auto leading-[0.8] mb-32"
        >
          A single <br className="hidden md:block" /> sprint.
        </motion.h2>

        <div className="max-w-6xl mx-auto relative group">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 relative z-10">
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               whileHover={{ y: -10 }}
               className="aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl border border-muted/20 relative"
             >
               <CreativeIdeationArt
                 className="h-full w-full"
                 variant="grid"
               />
             </motion.div>

             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               whileHover={{ y: -15 }}
               className="aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] shadow-[0_48px_80px_rgba(0,0,0,0.15)] border border-muted/20 relative -translate-y-12"
             >
               <CreativeIdeationArt
                 className="h-full w-full"
                 variant="flow"
                 palette={{ primary: "#D94225", secondary: "#FDE293", accent: "#D94225" }}
                 speed={2}
               />
               <motion.div
                 animate={{ opacity: [0.1, 0.3, 0.1] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute inset-0 bg-brand-red/10 pointer-events-none"
               />
             </motion.div>

             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               whileHover={{ y: -10 }}
               className="aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl border border-muted/20 relative translate-y-12"
             >
               <MatrixRainArt
                 className="h-full w-full"
                 color="#D94225"
                 title="SHIP READY"
                 subtitle="FINAL PHASE"
                 speedBase={8}
               />
             </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-2xl p-16 lg:p-24 rounded-[4rem] shadow-[0_64px_120px_-32px_rgba(0,0,0,0.15)] border border-brand-dark/5 max-w-2xl mx-auto relative z-20 group-hover:scale-[1.02] transition-transform duration-700"
          >
             <p className="text-muted-foreground/60 text-xl font-medium mb-12 leading-relaxed">
               Turn your idea into a launch-ready blueprint with live data flows, UI scaffolds, and execution steps in minutes.
             </p>
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white rounded-[2rem] py-9 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_-12px_rgba(217,66,37,0.3)] mb-10 transition-all">
                 Start Building
               </Button>
             </motion.div>
             <div className="flex items-center justify-center gap-4">
               <div className="h-px flex-1 bg-muted/20" />
               <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] whitespace-nowrap">
                 No credit card required • Ship a clickable concept today
               </p>
               <div className="h-px flex-1 bg-muted/20" />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
