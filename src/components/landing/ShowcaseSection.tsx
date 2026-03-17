import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CreativeIdeationArt } from "./CreativeArt";

export function ShowcaseSection() {
  return (
    <section className="py-32 bg-brand-dark text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-dark pointer-events-none" />

      <div className="section-container text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 backdrop-blur-sm border border-white/5"
        >
          PROMPT-TO-APP SHOWCASE
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight max-w-5xl mx-auto leading-tight mb-8"
        >
          From one sentence to a <br className="hidden md:block" /> launch-ready product system.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="max-w-2xl mx-auto text-white/40 text-xl mb-16 font-medium leading-relaxed"
        >
          Compose UX, data and deployment flows in one prompt loop with governance and live previews built in.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_-12px_rgba(217,66,37,0.3)] transition-all">
            OPEN INTERACTIVE DEMO →
          </Button>
        </motion.div>

        <div className="mt-24 relative max-w-6xl mx-auto group">
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -inset-10 bg-brand-red/40 blur-[150px] rounded-full opacity-10 pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-video rounded-[3rem] border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl shadow-2xl p-4 lg:p-6"
          >
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-brand-dark/50 shadow-inner group-hover:shadow-[0_0_80px_rgba(217,66,37,0.1)] transition-shadow duration-700">
              <CreativeIdeationArt
                className="h-full w-full"
                variant="system"
                theme="dark"
                palette={{ primary: "#AECBFA", secondary: "#FDE293", accent: "#D94225" }}
              />
            </div>

            {/* UI Floating elements decoration */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-8 w-32 h-32 bg-brand-red/20 blur-2xl rounded-full"
            />
          </motion.div>

          {/* Steps Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-4 rounded-[3rem] overflow-hidden border border-white/5 bg-white/[0.02]">
            {[
              {
                step: "01",
                title: "Prompt parsed into components and data contracts.",
                bg: "bg-brand-red"
              },
              {
                step: "02",
                title: "Visual system auto-composed with reusable primitives.",
                bg: "bg-white/5"
              },
              {
                step: "03",
                title: "Production-ready app delivered with deployment hooks.",
                bg: "bg-white/5"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`p-12 lg:p-16 text-left ${item.bg} flex flex-col justify-end min-h-[220px] backdrop-blur-xl`}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 block">STEP {item.step}</span>
                <p className="text-lg font-bold leading-tight uppercase tracking-tight">{item.title}</p>
                <div className="h-0.5 w-8 bg-white/20 mt-6 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
