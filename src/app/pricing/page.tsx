'use client';

import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { PricingSection } from "@/components/landing/PricingSection";

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll pro-rate your billing accordingly."
  },
  {
    question: "What's included in the free trial?",
    answer: "The free trial includes full access to all features. You can build and deploy 3 apps during the 14-day trial period with community support."
  },
  {
    question: "Do you offer annual pricing?",
    answer: "Yes! Annual plans come with a 20% discount. Contact our sales team to set up annual billing for your organization."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual subscriptions."
  },
  {
    question: "Is there a limit to the number of users on a plan?",
    answer: "Each plan tier is priced per user. You can add as many team members as needed, and we'll scale your billing accordingly."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee if you're not satisfied. No questions asked. Just reach out to our support team."
  }
];

const comparison = [
  { feature: "Visual Builder", starter: true, growth: true, scale: true },
  { feature: "Apps Allowed", starter: "3", growth: "12", scale: "Unlimited" },
  { feature: "Team Members", starter: "1", growth: "5", scale: "Unlimited" },
  { feature: "API Access", starter: true, growth: true, scale: true },
  { feature: "Database Integration", starter: true, growth: true, scale: true },
  { feature: "Custom Domain", starter: false, growth: true, scale: true },
  { feature: "Advanced Analytics", starter: false, growth: true, scale: true },
  { feature: "Priority Support", starter: false, growth: true, scale: true },
  { feature: "Dedicated Account Manager", starter: false, growth: false, scale: true },
  { feature: "SLA Guarantee", starter: "99.5%", growth: "99.9%", scale: "99.99%" },
];

export default function Pricing() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFaq = (idx: number) => {
    setOpenFaqs(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

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
                PRICING
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] text-brand-dark mb-8">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Choose the perfect plan for your team. Scale as you grow without worrying about replatforming.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans */}
        <PricingSection />

        {/* Feature Comparison */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-6">Feature Comparison</h2>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto">
                See exactly what&apos;s included in each plan
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto overflow-x-auto"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-muted/20">
                    <th className="text-left py-6 px-6 font-black text-brand-dark">Feature</th>
                    <th className="text-center py-6 px-6 font-black text-brand-dark">Starter</th>
                    <th className="text-center py-6 px-6 font-black text-brand-red">Growth</th>
                    <th className="text-center py-6 px-6 font-black text-brand-dark">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-muted/10 hover:bg-brand-cream/20 transition-colors"
                    >
                      <td className="py-6 px-6 font-semibold text-brand-dark">{row.feature}</td>
                      <td className="py-6 px-6 text-center">
                        {typeof row.starter === "boolean" ? (
                          row.starter ? (
                            <Check className="w-5 h-5 text-brand-red mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted/30 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-brand-dark">{row.starter}</span>
                        )}
                      </td>
                      <td className="py-6 px-6 text-center bg-brand-red/5">
                        {typeof row.growth === "boolean" ? (
                          row.growth ? (
                            <Check className="w-5 h-5 text-brand-red mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted/30 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-brand-dark">{row.growth}</span>
                        )}
                      </td>
                      <td className="py-6 px-6 text-center">
                        {typeof row.scale === "boolean" ? (
                          row.scale ? (
                            <Check className="w-5 h-5 text-brand-red mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted/30 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-brand-dark">{row.scale}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 bg-brand-dark text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto">
                Have a question? We&apos;re here to help.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 hover:border-brand-red/30 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-8 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-lg font-black text-left">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openFaqs.includes(idx) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 flex-shrink-0" />
                    </motion.div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaqs.includes(idx) ? "auto" : 0,
                      opacity: openFaqs.includes(idx) ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 border-t border-white/10 pt-6">
                      <p className="text-white/60 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
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
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto mb-12">
                Start with a 14-day free trial. No credit card required.
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
