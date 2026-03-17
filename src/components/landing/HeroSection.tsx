import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { WireframeGrid, NodeGraph } from "./WireframeDecorations";

interface HeroSectionProps {
  onSendMessage?: (msg: string) => void;
  isLoading?: boolean;
}

export function HeroSection({ onSendMessage, isLoading }: HeroSectionProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim() && onSendMessage && !isLoading) {
      onSendMessage(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section className="relative bg-brand-cream/40 pt-24 pb-28 lg:pt-36 lg:pb-40 overflow-hidden">
      <WireframeGrid className="text-brand-dark/20" />
      <NodeGraph className="top-1/4 left-0 hidden xl:block" />
      <NodeGraph className="bottom-1/4 right-0 hidden xl:block rotate-180" />

      {/* Content — centered flex column */}
      <div className="relative z-10 flex flex-col items-center px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center w-full max-w-4xl"
        >
          <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-brand-dark to-brand-dark/70 text-center leading-[1.05]">
            Turn your ideas <br className="hidden md:block" /> into apps
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl leading-relaxed text-center">
            Simply UI lets teams build production-ready AI products in minutes using prompts and modular workflows.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-14 w-full max-w-2xl"
        >
          <div className="relative flex items-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-brand-dark/5 focus-within:ring-brand-red/20 transition-all">
            <Search className="ml-5 h-5 w-5 text-muted-foreground/40 shrink-0" />
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Make a customer support app that summarizes tickets and drafts replies"
              className="border-none bg-transparent h-14 text-base focus-visible:ring-0 placeholder:text-muted-foreground/40 px-4"
            />
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className="h-12 w-12 rounded-full bg-brand-red hover:bg-brand-red/90 text-white shrink-0 shadow-lg shadow-brand-red/20 transition-transform active:scale-95 mr-1"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ArrowRight className="h-6 w-6" />}
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {["Reporting Dashboard", "E-com Platform", "Onboarding Portal"].map((tag) => (
              <motion.button
                key={tag}
                onClick={() => {
                  setPrompt(tag);
                  if (onSendMessage && !isLoading) {
                    onSendMessage(tag);
                  }
                }}
                disabled={isLoading}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 rounded-full bg-white border border-brand-dark/10 text-sm font-bold hover:border-brand-red/30 hover:text-brand-red transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Background radial gradient decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-gradient-to-b from-brand-red/[0.07] to-transparent rounded-full blur-[120px] -z-0 opacity-50 pointer-events-none" />
    </section>
  );
}
