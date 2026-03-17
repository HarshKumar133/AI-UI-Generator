import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function EnterpriseSection() {
  return (
    <section className="py-32 bg-brand-dark text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />
      
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red mb-8 block">ENTERPRISE</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-10">
              Need private cloud, governance, and release certainty?
            </h2>
            <p className="text-white/40 text-xl mb-12 leading-relaxed font-medium">
              SOC2 Type II, SSO/SAML, RBAC, audit trails, private networking, and dedicated architecture guidance for teams that can't fail.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-red/20 transition-all">
                BOOK ENTERPRISE WORKSHOP →
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative rounded-[3.5rem] overflow-hidden aspect-square lg:aspect-video shadow-[0_64px_120px_-32px_rgba(0,0,0,0.5)] group"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1 }}
              src="https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg" 
              alt="Enterprise Data Center" 
              className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
            
            {/* Visual indicators */}
            <div className="absolute top-12 left-12 flex items-center gap-3">
              <div className="h-2 w-2 bg-brand-red rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">SYSTEM LIVE: REGION US-WEST</span>
            </div>
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full" 
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-brand-red/20 rounded-full" 
            />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-brand-red/90 shadow-[0_0_60px_rgba(217,66,37,0.5)] rotate-45 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 rotate-45" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
