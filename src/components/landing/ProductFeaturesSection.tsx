import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Code2, Zap, Lock, Users, BarChart3, Rocket } from "lucide-react";

const features = [
  {
    icon: Code2,
    label: "01 / BUILD FASTER",
    title: "Create apps with intuitive visual builder",
    description: "Drag-and-drop components, pre-built templates, and smart UI generation powered by AI. No need to write boilerplate code anymore.",
    metric: "-65%",
    metricLabel: "Dev Time",
    benefits: ["Visual components", "Instant preview", "Auto-responsive"]
  },
  {
    icon: Users,
    label: "02 / COLLABORATE",
    title: "Real-time teamwork across design and dev",
    description: "Designers and developers work simultaneously on the same canvas. Comments, version history, and live previews keep everyone aligned.",
    metric: "+78%",
    metricLabel: "Team Productivity",
    benefits: ["Live collaboration", "Version control", "Design handoff"]
  },
  {
    icon: Rocket,
    label: "03 / DEPLOY INSTANTLY",
    title: "Ship to production in one click",
    description: "Optimized builds, automatic API integration, and CI/CD pipelines built-in. Go from idea to live in minutes, not weeks.",
    metric: "+3x",
    metricLabel: "Release Velocity",
    benefits: ["One-click deploy", "Auto-scaling", "Zero-downtime updates"]
  }
];

export function ProductFeaturesSection() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <span className="inline-block px-3 py-1 bg-brand-cream text-brand-dark/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
            CORE FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight max-w-4xl mx-auto leading-[0.9] text-brand-dark">
            EVERYTHING YOU NEED TO BUILD FASTER
          </h2>
          <p className="mt-8 text-xl text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Powerful tools designed for modern development teams. Build, collaborate, and deploy with confidence.
          </p>
        </motion.div>

        <div className="space-y-48">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className={cn(
                  "flex flex-col gap-16 lg:gap-24 items-center",
                  idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                )}
              >
                <div className="flex-1 max-w-xl">
                  <span className="text-[10px] font-black text-brand-red tracking-[0.2em] uppercase mb-6 block">
                    {feature.label}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-muted-foreground/60 mb-12 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex flex-col gap-4 mb-12">
                    {feature.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0" />
                        <span className="text-sm font-semibold text-brand-dark">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Button className="bg-brand-dark text-white rounded-full px-10 py-7 hover:bg-brand-red transition-all text-[11px] font-black uppercase tracking-[0.1em] shadow-xl hover:shadow-brand-red/20 active:scale-95">
                    Learn More →
                  </Button>
                </div>

                <div className="flex-1 relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden group shadow-[0_48px_80px_-24px_rgba(0,0,0,0.15)] bg-gradient-to-br from-brand-cream/50 to-brand-cream/20">
                  {/* Feature Icon Background */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center opacity-30"
                  >
                    <IconComponent className="w-[300px] h-[300px] text-brand-red/20 absolute" />
                  </motion.div>

                  {/* Content Grid */}
                  <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <IconComponent className="w-16 h-16 text-brand-red" />
                    </motion.div>
                  </div>

                  {/* Metric Badge Overlay */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className={cn(
                      "absolute bottom-0 right-0 p-10 pt-12 pb-8 w-full max-w-[320px] bg-brand-dark text-white flex flex-col justify-end",
                      "rounded-tl-[4rem] backdrop-blur-xl bg-brand-dark/95"
                    )}
                  >
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 mb-3 block">
                      {feature.metricLabel}
                    </span>
                    <div className="text-5xl font-black tracking-tighter mb-1">
                      {feature.metric}
                    </div>
                    <div className="h-1 w-12 bg-brand-red rounded-full mt-4" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
