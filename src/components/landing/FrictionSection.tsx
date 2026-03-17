import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CreativeIdeationArt } from "./CreativeArt";

const features = [
  {
    label: "01 / ALIGNMENT",
    title: "Unify the workstream before it fragments.",
    description: "One timeline, one source of truth, one execution language across product, design, and go-to-market.",
    buttonText: "Build first operating map",
    metric: "-34%",
    metricLabel: "CYCLE TIME",
    metricSub: "SYSTEM SYNC",
    art: <CreativeIdeationArt
      className="h-full w-full"
      variant="nodes"
      palette={{ primary: "#AECBFA", secondary: "#FDE293", accent: "#D94225" }}
    />,
    reverse: false
  },
  {
    label: "02 / ORCHESTRATION",
    title: "Coordinate every dependency as one system.",
    description: "Planning, review, and delivery stay synchronized, so teams spend less time reconciling and more time shipping.",
    buttonText: "Activate cross-team flow",
    metric: "+41%",
    metricLabel: "CROSS-TEAM SLA",
    metricSub: "OPEN EXECUTION",
    art: <CreativeIdeationArt
      variant="orbit"
      theme="dark"
      className="h-full w-full bg-brand-dark/95"
      palette={{ primary: "#D94225", secondary: "#FDE293", accent: "#fff" }}
    />,
    reverse: true
  },
  {
    label: "03 / VELOCITY",
    title: "Turn each release into leverage for the next.",
    description: "Insights feed planning in real time, making progress compounding instead of episodic.",
    buttonText: "Scale your release engine",
    metric: "+3.2x",
    metricLabel: "COMPOUNDING OUTPUT",
    metricSub: "MOMENTUM STACK",
    art: <CreativeIdeationArt
      variant="flow"
      className="h-full w-full bg-brand-cream/10"
      palette={{ primary: "#AECBFA", secondary: "#D94225", accent: "#D94225" }}
      speed={1.5}
    />,
    reverse: false
  }
];

export function FrictionSection() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-32"
        >
          <span className="inline-block px-3 py-1 bg-brand-cream text-brand-dark/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
            STORY SYSTEM / OPERATING SHIFT
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight max-w-4xl mx-auto leading-[0.9] text-brand-dark">
            FROM FRICTION TO FORWARD FORCE
          </h2>
          <p className="mt-8 text-xl text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
            A three-act narrative of how modern teams move from reactive execution to a repeatable growth-engine. Every panel blends context, proof, and a clear next step.
          </p>
        </motion.div>

        <div className="space-y-48">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={cn(
                "flex flex-col gap-16 lg:gap-24 items-center",
                feature.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
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
                <Button className="bg-brand-dark text-white rounded-full px-10 py-7 hover:bg-brand-red transition-all text-[11px] font-black uppercase tracking-[0.1em] shadow-xl hover:shadow-brand-red/20 active:scale-95">
                  {feature.buttonText}
                </Button>
              </div>

              <div className="flex-1 relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden group shadow-[0_48px_80px_-24px_rgba(0,0,0,0.15)] bg-brand-cream/20">
                {feature.art}

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
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 leading-none">
                      {feature.metricLabel}
                    </span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-20 leading-none">
                      {feature.metricSub}
                    </span>
                  </div>
                  <div className="text-6xl font-black tracking-tighter leading-none mb-1">
                    {feature.metric}
                  </div>
                  <div className="h-1 w-12 bg-brand-red rounded-full mt-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
