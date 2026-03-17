'use client';

import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Code2, Zap, Shield, Cloud, Database, Workflow, Github, Figma, Slack, MoreHorizontal } from "lucide-react";

const features = [
  { icon: Code2, title: "Visual Builder", description: "Drag-and-drop UI components with code export" },
  { icon: Workflow, title: "Workflows", description: "Automate complex user journeys" },
  { icon: Database, title: "Data Integration", description: "Connect to any API or database" },
  { icon: Cloud, title: "Cloud Hosting", description: "Deploy and scale automatically" },
  { icon: Shield, title: "Security First", description: "Enterprise-grade security and compliance" },
  { icon: Zap, title: "Real-time", description: "Live collaboration and updates" },
];

const integrations = [
  { icon: Github, name: "GitHub" },
  { icon: Figma, name: "Figma" },
  { icon: Slack, name: "Slack" },
  { icon: Cloud, name: "AWS" },
  { icon: Database, name: "Postgres" },
  { icon: MoreHorizontal, name: "100+ More" },
];

export default function Product() {
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
                PRODUCT
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] text-brand-dark mb-8">
                Everything Needed to Build Modern Apps
              </h1>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
                A comprehensive platform designed for teams who want to build faster, collaborate better, and deploy with confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-6">Core Features</h2>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto">
                Everything you need to build professional applications from concept to deployment
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white border-2 border-muted/20 rounded-[2rem] p-10 hover:border-brand-red/20 transition-all hover:shadow-xl"
                  >
                    <Icon className="w-12 h-12 text-brand-red mb-6" />
                    <h3 className="text-2xl font-black text-brand-dark mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-32 bg-brand-dark text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">Integrations</h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto">
                Connect with your favorite tools and services
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {integrations.map((integration, idx) => {
                const Icon = integration.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 hover:border-brand-red/30 transition-all"
                  >
                    <Icon className="w-8 h-8" />
                    <p className="text-sm font-bold text-center">{integration.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-6">Built on Modern Tech</h2>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto">
                We use the best tools and frameworks to ensure performance and reliability
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  {
                    category: "Frontend",
                    items: ["React 18+", "TypeScript", "Tailwind CSS", "Framer Motion"]
                  },
                  {
                    category: "Backend",
                    items: ["Node.js", "Express", "PostgreSQL", "Redis"]
                  },
                  {
                    category: "Infrastructure",
                    items: ["AWS", "Docker", "Kubernetes", "CDN"]
                  },
                  {
                    category: "Tools",
                    items: ["Git", "GitHub Actions", "Vercel", "Netlify"]
                  }
                ].map((stack, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border-2 border-muted/20 rounded-[2rem] p-10"
                  >
                    <h3 className="text-2xl font-black text-brand-dark mb-6">{stack.category}</h3>
                    <ul className="space-y-3">
                      {stack.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0" />
                          <span className="font-semibold text-brand-dark">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-brand-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-8">Ready to Get Started?</h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto mb-12">
                Join thousands of teams building amazing applications with Simply UI
              </p>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_-12px_rgba(217,66,37,0.3)]">
                  Start Free Trial →
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
