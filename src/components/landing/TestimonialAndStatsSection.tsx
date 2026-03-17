import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Rocket, Lightbulb, Zap, Users, Building2, ShieldCheck, Globe } from "lucide-react";

const testimonials = [
  {
    quote: "Simply UI cut our development time in half. What used to take weeks now takes days.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechVentures",
    rating: 5,
    avatarIcon: <Rocket className="w-6 h-6 text-brand-red" />
  },
  {
    quote: "The collaboration features are game-changing. Our designers and developers are finally on the same page.",
    author: "Michael Chen",
    role: "Product Lead",
    company: "StartupLabs",
    rating: 5,
    avatarIcon: <Lightbulb className="w-6 h-6 text-brand-red" />
  },
  {
    quote: "We went from concept to production in a single sprint. Absolutely incredible tool.",
    author: "Emma Davis",
    role: "Engineering Manager",
    company: "CloudScale",
    rating: 5,
    avatarIcon: <Zap className="w-6 h-6 text-brand-red" />
  }
];

const stats = [
  { number: "50K+", label: "Active Users", icon: <Users className="w-8 h-8" /> },
  { number: "1M+", label: "Apps Built", icon: <Building2 className="w-8 h-8" /> },
  { number: "99.9%", label: "Uptime", icon: <ShieldCheck className="w-8 h-8" /> },
  { number: "180+", label: "Countries", icon: <Globe className="w-8 h-8" /> }
];

export function TestimonialAndStatsSection() {
  return (
    <>
      {/* Testimonials Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-3 py-1 bg-brand-cream text-brand-dark/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
              TRUSTED BY TEAMS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight max-w-4xl mx-auto leading-[0.9] text-brand-dark">
              LOVED BY DEVELOPERS WORLDWIDE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white border-2 border-muted/20 rounded-[2rem] p-10 hover:border-brand-red/20 transition-all shadow-xl hover:shadow-2xl"
              >
                {/* Rating */}
                <div className="flex gap-1.5 mb-6">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Star className="w-5 h-5 fill-brand-red text-brand-red" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xl font-bold text-brand-dark mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-muted/20 pt-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-red/20 to-brand-cream/40 flex items-center justify-center">
                    {testimonial.avatarIcon}
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-32 bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-brand-dark to-brand-dark pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight max-w-4xl mx-auto leading-[0.9]">
              JOIN A GROWING COMMUNITY
            </h2>
            <p className="mt-8 text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
              Become part of a global community of innovators and builders transforming how software is created.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-24">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-10 text-center backdrop-blur-sm hover:bg-white/10 hover:border-brand-red/30 transition-all"
              >
                <div className="mb-4 text-white/60 flex justify-center">{stat.icon}</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
                  className="text-5xl font-black mb-3"
                >
                  {stat.number}
                </motion.div>
                <p className="text-white/40 font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white/5 border border-white/10 p-16 lg:p-24 rounded-[4rem] backdrop-blur-xl max-w-3xl mx-auto text-center"
          >
            <p className="text-white/40 text-xl font-medium mb-12 leading-relaxed">
              Ready to transform your development workflow? Join thousands of teams already building the future with Simply UI.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_-12px_rgba(217,66,37,0.3)] transition-all">
                Start Building Today →
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] border-white/20 text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </motion.div>
            <div className="flex items-center justify-center gap-4 mt-12">
              <div className="h-px flex-1 bg-white/10" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">
                No credit card required
              </p>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
