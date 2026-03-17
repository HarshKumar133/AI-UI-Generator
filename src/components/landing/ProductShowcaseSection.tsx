import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, ArrowRight, Palette, Zap, Rocket } from "lucide-react";

export function ProductShowcaseSection() {
  return (
    <section className="py-32 bg-brand-dark text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-dark pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block px-3 py-1 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 backdrop-blur-sm border border-white/5"
        >
          PRODUCT WALKTHROUGH
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight max-w-5xl mx-auto leading-tight mb-8"
        >
          Build Production Apps <br className="hidden md:block" /> In Minutes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="max-w-2xl mx-auto text-white/40 text-xl mb-16 font-medium leading-relaxed"
        >
          Drag-and-drop builder with real-time collaboration, instant previews, and one-click deployment.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8"
        >
          <Button className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_-12px_rgba(217,66,37,0.3)] transition-all inline-flex items-center gap-3">
            <Play className="w-4 h-4 fill-current" /> WATCH DEMO
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

          {/* Main Showcase Container */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-video rounded-[3rem] border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl shadow-2xl p-4 lg:p-6 group-hover:border-brand-red/30 transition-colors"
          >
            {/* Simulated Product Dashboard */}
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand-dark/50 to-brand-dark/80 shadow-inner relative">
              {/* Navbar */}
              <div className="bg-white/5 border-b border-white/10 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-red/20 border border-brand-red/40" />
                  <div className="text-sm font-bold">Simply UI Dashboard</div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/40">
                  <span>Projects</span>
                  <span className="text-white/20">|</span>
                  <span>Team</span>
                  <span className="text-white/20">|</span>
                  <span>Settings</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-12 gap-4 p-8 h-[calc(100%-80px)]">
                {/* Sidebar */}
                <div className="col-span-3 bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col gap-2">
                  <div className="h-8 bg-brand-red/30 rounded-lg" />
                  <div className="h-6 bg-white/10 rounded-lg" />
                  <div className="h-6 bg-white/10 rounded-lg" />
                  <div className="flex-1" />
                  <div className="h-12 bg-white/5 rounded-lg border border-white/10" />
                </div>

                {/* Main Canvas */}
                <div className="col-span-9 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex gap-4">
                    <div className="flex-1 h-20 bg-gradient-to-r from-brand-red/20 to-brand-red/10 rounded-xl border border-white/10 flex items-center justify-center">
                      <div className="text-white/40 text-sm font-semibold">Canvas Area</div>
                    </div>
                    <div className="w-32 bg-white/5 rounded-xl border border-white/10" />
                  </div>

                  {/* Component Grid */}
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-gradient-to-br rounded-lg border border-white/10 flex items-center justify-center text-xs font-bold text-white/40 ${
                          i === 2 ? "col-span-2 row-span-2 bg-brand-red/20 text-white/60 border-brand-red/40" : "bg-white/5"
                        }`}
                      >
                        Component {i}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating UI Elements */}
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
                icon: <Palette className="w-7 h-7" />,
                title: "Drag Components",
                desc: "Build your UI with our visual component library"
              },
              {
                step: "02",
                icon: <Zap className="w-7 h-7" />,
                title: "Connect Data",
                desc: "Link to APIs and databases in real-time"
              },
              {
                step: "03",
                icon: <Rocket className="w-7 h-7" />,
                title: "Deploy Instantly",
                desc: "Ship to production with one click"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`p-12 lg:p-16 text-left flex flex-col justify-between min-h-[240px] backdrop-blur-xl ${
                  idx === 1 ? "bg-brand-red/20 border-l border-r border-white/5" : "bg-white/5"
                }`}
              >
                <div>
                  <div className="mb-3 text-white/70">{item.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3 block">STEP {item.step}</span>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40">{item.desc}</p>
                </div>
                <div className="h-0.5 w-8 bg-white/20 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
