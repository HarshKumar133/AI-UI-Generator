import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Per user / month",
    features: [
      "3 active apps",
      "40x monthly generators",
      "Community support"
    ],
    buttonText: "START FREE →",
    featured: false
  },
  {
    name: "Growth",
    price: "129",
    description: "Per user / month",
    features: [
      "12 active apps",
      "500x monthly generators",
      "Priority reviews"
    ],
    buttonText: "CHOOSE GROWTH →",
    featured: true
  },
  {
    name: "Scale",
    price: "399",
    description: "Per user / month",
    features: [
      "Unlimited active apps",
      "1.5M monthly generators",
      "Dedicated architect"
    ],
    buttonText: "BOOK SCALE PLAN →",
    featured: false
  }
];

export function PricingSection() {
  return (
    <section className="py-32 bg-brand-dark text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/10 blur-[180px] -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-red/5 blur-[200px] -z-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-10 block"
        >
          PRICING
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight max-w-5xl mx-auto leading-tight mb-8"
        >
          Choose your operating cadence, then scale with zero replatforming.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="max-w-2xl mx-auto text-white/40 text-xl mb-24 leading-relaxed font-medium"
        >
          Every tier ships the full builder. You only unlock more velocity, team controls, and support depth.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-end">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative p-12 lg:p-16 rounded-[3.5rem] flex flex-col items-start text-left border ${
                plan.featured 
                ? "bg-brand-red border-brand-red shadow-[0_48px_80px_-16px_rgba(217,66,37,0.3)] z-20" 
                : "bg-white/[0.03] border-white/10 hover:border-white/20 transition-all backdrop-blur-xl"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-brand-red text-[11px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-2xl">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-8">
                {plan.name}
              </div>

              <div className="mb-8 flex items-start gap-1">
                <span className={`text-3xl font-black mt-3 ${plan.featured ? "text-white/40" : "text-white/20"}`}>$</span>
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  className="text-[80px] md:text-[110px] font-black leading-none tracking-tighter"
                >
                  {plan.price}
                </motion.span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-12">{plan.description}</p>
              
              <ul className="space-y-6 mb-16 flex-1 w-full">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-4 text-base font-bold tracking-tight">
                    <div className={`p-1 rounded-full ${plan.featured ? "bg-white" : "bg-brand-red"}`}>
                      <Check className={`h-3 w-3 ${plan.featured ? "text-brand-red" : "text-white"}`} strokeWidth={4} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button className={`w-full py-9 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
                  plan.featured 
                  ? "bg-white text-brand-red hover:bg-white/90 shadow-brand-red/20" 
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-xl"
                }`}>
                  {plan.buttonText}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
