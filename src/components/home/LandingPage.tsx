import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductFeaturesSection } from "@/components/landing/ProductFeaturesSection";
import { ProductShowcaseSection } from "@/components/landing/ProductShowcaseSection";
import { TestimonialAndStatsSection } from "@/components/landing/TestimonialAndStatsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { EnterpriseSection } from "@/components/landing/EnterpriseSection";

interface LandingPageProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export function LandingPage({ onSendMessage, isLoading }: LandingPageProps) {
    return (
        <div className="min-h-screen font-sans selection:bg-brand-red selection:text-white overflow-x-hidden">
            <Navbar />
            <main className="relative overflow-x-clip">
                <HeroSection onSendMessage={onSendMessage} isLoading={isLoading} />
                <ProductFeaturesSection />
                <ProductShowcaseSection />
                <TestimonialAndStatsSection />
                <PricingSection />
                <EnterpriseSection />
            </main>
            <footer className="py-20 bg-white border-t border-muted">
                <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold tracking-tight">Simply UI</span>
                        <span className="text-xs font-bold text-muted-foreground ml-4">© 2024 Simply UI, Inc.</span>
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
