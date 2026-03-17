import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { WireframeGrid, NodeGraph } from "./WireframeDecorations";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface HeroSectionProps {
  onSendMessage?: (msg: string) => void;
  isLoading?: boolean;
}

export function HeroSection({ onSendMessage, isLoading }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <section className="relative bg-brand-cream/40 py-20 lg:py-40 overflow-hidden">
      <WireframeGrid className="text-brand-dark/20" />
      <NodeGraph className="top-1/4 left-0 hidden xl:block" />
      <NodeGraph className="bottom-1/4 right-0 hidden xl:block rotate-180" />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-brand-dark to-brand-dark/70">
            Turn your ideas <br className="hidden md:block" /> into apps
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl leading-relaxed">
            Simply UI lets teams build production-ready AI products in minutes using prompts and modular workflows.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-3xl relative"
        >
          <div className="relative flex items-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-brand-dark/5 focus-within:ring-brand-red/20 transition-all">
            <Search className="ml-6 h-6 w-6 text-muted-foreground/40" />
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Make a customer support app that summarizes tickets and drafts replies" 
              className="border-none bg-transparent h-16 text-lg focus-visible:ring-0 placeholder:text-muted-foreground/40"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className="h-14 w-14 rounded-full bg-brand-red hover:bg-brand-red/90 text-white shrink-0 shadow-lg shadow-brand-red/20 transition-transform active:scale-95"
            >
              {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <ArrowRight className="h-7 w-7" />}
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {["Reporting Dashboard", "E-com Platform", "Onboarding Portal"].map((tag) => (
              <motion.button 
                key={tag}
                onClick={() => {
                  setInputValue(tag);
                  if (onSendMessage) onSendMessage(tag);
                }}
                disabled={isLoading}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-full bg-white border border-brand-dark/10 text-sm font-bold hover:border-brand-red/30 hover:text-brand-red transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-gradient-to-b from-brand-red/[0.07] to-transparent rounded-full blur-[120px] -z-0 opacity-50 pointer-events-none" />
    </section>
  );
}
