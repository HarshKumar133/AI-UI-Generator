'use client';

import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, Zap, TrendingUp, Settings, Users, BarChart3, ArrowRight, Rocket, Cloud } from "lucide-react";

const useCases = [
  {
    icon: Briefcase,
    title: "SaaS Startups",
    description: "Launch your MVP in days instead of months. Build fully-featured applications with user authentication, billing, and integrations.",
    benefits: ["Rapid MVP development", "Built-in authentication", "Payment integration ready", "Database setup included"],
    metric: "10x faster launch",
    cta: "Explore SaaS Template"
  },
  {
    icon: TrendingUp,
    title: "Enterprise Solutions",
    description: "Build complex applications with team collaboration, audit logs, and enterprise-grade security built-in from day one.",
    benefits: ["Role-based access control", "Audit logging", "SSO integration", "Compliance ready"],
    metric: "99.9% uptime",
    cta: "Enterprise Features"
  },
  {
    icon: Zap,
    title: "Mobile-First Apps",
    description: "Create responsive applications that work seamlessly across devices. One codebase, optimized for all screens.",
    benefits: ["Responsive design", "Progressive enhancement", "Offline support", "Mobile optimization"],
    metric: "Perfect mobile score",
    cta: "Mobile Templates"
  },
  {
    icon: BarChart3,
    title: "Data & Analytics",
    description: "Build powerful dashboards and reporting tools. Real-time data visualization with intuitive interfaces.",
    benefits: ["Live data updates", "Custom charts", "Export capabilities", "Real-time sync"],
    metric: "Sub-second queries",
    cta: "Analytics Starter"
  },
  {
    icon: Settings,
    title: "Internal Tools",
    description: "Quickly build admin dashboards and internal tools for your team. Eliminate repetitive manual work.",
    benefits: ["Admin panels", "Bulk operations", "Custom workflows", "Role management"],
    metric: "80% time saved",
    cta: "Admin Dashboard"
  },
  {
    icon: Users,
    title: "Marketplace Platform",
    description: "Create two-sided marketplaces with vendor management, payments, and sophisticated matching algorithms.",
    benefits: ["Vendor dashboard", "Marketplace features", "Payment splitting", "Review system"],
    metric: "Multi-tenant ready",
    cta: "Marketplace Kit"
  }
];

export default function UseCases() {
  return (
    <div className="min-h-screen font-sans selection:bg-brand-red selection:text-white overflow-x-hidden">
      <Navbar />
      
      <main className="relative overflow-x-clip">
        {/* Hero Section */}
        <section className="py-32 bg-gradient-to-b from-brand-cream/40 to-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 max-w-4xl mx-auto"
            >
              <span className="inline-block px-3 py-1 bg-brand-cream text-brand-dark/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
                USE CASES
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] text-brand-dark mb-8">
                Built for Every Type of Application
              </h1>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
                From startups to enterprises, Simply UI empowers teams to build applications faster and better.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {useCases.map((useCase, idx) => {
                const Icon = useCase.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white border-2 border-muted/20 rounded-[2rem] p-10 hover:border-brand-red/20 hover:shadow-2xl transition-all flex flex-col"
                  >
                    <Icon className="w-12 h-12 text-brand-red mb-6" />
                    <h3 className="text-2xl font-black text-brand-dark mb-3">{useCase.title}</h3>
                    <p className="text-muted-foreground/60 leading-relaxed mb-8">{useCase.description}</p>
                    
                    <div className="space-y-2 mb-8 flex-1">
                      {useCase.benefits.map((benefit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                          className="flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-muted/20">
                      <p className="text-sm font-bold text-brand-red mb-4">{useCase.metric}</p>
                      <Button variant="outline" className="w-full border-brand-red text-brand-red hover:bg-brand-red/5 rounded-full">
                        {useCase.cta} <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-32 bg-brand-dark text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">Success Stories</h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto">
                See how companies like yours are transforming their development process
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  company: "TechVentures",
                  story: "Reduced time-to-market by 65% while maintaining code quality",
                  metric: "3 months → 3 weeks",
                  icon: "rocket"
                },
                {
                  company: "StartupLabs",
                  story: "Expanded team from 2 to 15 developers without losing collaboration",
                  metric: "10x team growth",
                  icon: "users"
                },
                {
                  company: "CloudScale",
                  story: "Built scalable infrastructure supporting 1M+ daily active users",
                  metric: "99.99% uptime",
                  icon: "cloud"
                },
                {
                  company: "DataFlow",
                  story: "Created real-time analytics dashboard powering 500+ enterprise clients",
                  metric: "1000s of dashboards",
                  icon: "chart"
                }
              ].map((story, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-[2rem] p-10 hover:bg-white/10 hover:border-brand-red/30 transition-all"
                >
                  <div className="mb-4 w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
                    {story.icon === "rocket" && <Rocket className="w-5 h-5" />}
                    {story.icon === "users" && <Users className="w-5 h-5" />}
                    {story.icon === "cloud" && <Cloud className="w-5 h-5" />}
                    {story.icon === "chart" && <BarChart3 className="w-5 h-5" />}
                  </div>
                  <h3 className="text-xl font-black mb-4">{story.company}</h3>
                  <p className="text-white/60 mb-6 leading-relaxed">{story.story}</p>
                  <p className="text-brand-red font-bold text-lg">{story.metric}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-8">
                Which Use Case Matches Your Goals?
              </h2>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto mb-12">
                Get a personalized demo showing how Simply UI can accelerate your specific project
              </p>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_-12px_rgba(217,66,37,0.3)]">
                  Schedule A Demo →
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-white border-t border-muted">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">Simply UI</span>
            <span className="text-xs font-bold text-muted-foreground ml-4">© 2026 Simply UI, Inc.</span>
          </div>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            <a href="#" className="hover:text-brand-red transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-red transition-colors">GitHub</a>
            <a href="#" className="hover:text-brand-red transition-colors">Discord</a>
            <a href="#" className="hover:text-brand-red transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
