'use client';

import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Search, Rocket, Palette, Users, Ship, Database, Zap } from "lucide-react";
import { useState } from "react";

const articles = [
  {
    id: 1,
    title: "How to Build Your First Web App in 24 Hours",
    excerpt: "Learn the essential steps to take your idea from concept to a working web application using Simply UI.",
    author: "Sarah Chen",
    date: "Mar 10, 2026",
    category: "Getting Started",
    readTime: "8 min read",
    image: "rocket"
  },
  {
    id: 2,
    title: "Design Systems: Building Consistency at Scale",
    excerpt: "Explore how Simply UI helps teams maintain design consistency across large projects without bloat.",
    author: "Michael Park",
    date: "Mar 8, 2026",
    category: "Design",
    readTime: "12 min read",
    image: "palette"
  },
  {
    id: 3,
    title: "Real-time Collaboration: The Future of Development",
    excerpt: "Discover how real-time collaboration features are changing the way development teams work together.",
    author: "Emma Wilson",
    date: "Mar 5, 2026",
    category: "Collaboration",
    readTime: "10 min read",
    image: "users"
  },
  {
    id: 4,
    title: "Deploying to Production with Confidence",
    excerpt: "Best practices for deployment, monitoring, and ensuring zero-downtime updates in production.",
    author: "James Rodriguez",
    date: "Mar 1, 2026",
    category: "DevOps",
    readTime: "15 min read",
    image: "ship"
  },
  {
    id: 5,
    title: "Database Design Patterns for Modern Apps",
    excerpt: "Learn proven patterns for designing scalable and maintainable database schemas.",
    author: "Lisa Zhang",
    date: "Feb 28, 2026",
    category: "Backend",
    readTime: "14 min read",
    image: "database"
  },
  {
    id: 6,
    title: "Performance Optimization: Achieving Sub-Second Load Times",
    excerpt: "Techniques and tools for identifying and eliminating performance bottlenecks.",
    author: "Alex Kumar",
    date: "Feb 25, 2026",
    category: "Performance",
    readTime: "11 min read",
    image: "zap"
  }
];

const categories = ["All", "Getting Started", "Design", "Collaboration", "DevOps", "Backend", "Performance"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                BLOG & RESOURCES
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] text-brand-dark mb-8">
                Learn & Master Simply UI
              </h1>
              <p className="text-xl text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Expert tips, tutorials, and insights to help you build better applications faster.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 rounded-full border-2 border-muted/20 bg-white focus:border-brand-red focus:outline-none text-lg font-medium transition-colors"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-12 bg-white border-b border-muted/20 sticky top-16 z-40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              {categories.map((category, idx) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-[0.1em] transition-all ${
                    selectedCategory === category
                      ? "bg-brand-red text-white shadow-lg"
                      : "bg-muted/10 text-muted-foreground hover:bg-muted/20 border border-muted/20"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            {filteredArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-xl text-muted-foreground/60">No articles found. Try a different search or category.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {filteredArticles.map((article, idx) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white border-2 border-muted/20 rounded-[2rem] overflow-hidden hover:border-brand-red/20 hover:shadow-2xl transition-all flex flex-col h-full group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-brand-cream/40 to-brand-cream/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                      <div className="w-16 h-16 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
                        {article.image === "rocket" && <Rocket className="w-8 h-8" />}
                        {article.image === "palette" && <Palette className="w-8 h-8" />}
                        {article.image === "users" && <Users className="w-8 h-8" />}
                        {article.image === "ship" && <Ship className="w-8 h-8" />}
                        {article.image === "database" && <Database className="w-8 h-8" />}
                        {article.image === "zap" && <Zap className="w-8 h-8" />}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-block px-3 py-1 bg-brand-cream text-brand-dark text-[9px] font-black uppercase tracking-[0.1em] rounded-full">
                          {article.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-brand-dark mb-3 leading-tight group-hover:text-brand-red transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-muted-foreground/60 leading-relaxed mb-6 flex-1">
                        {article.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground/40 mb-6 pb-6 border-t border-muted/20 pt-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{article.date}</span>
                        </div>
                        <span className="text-xs font-bold">{article.readTime}</span>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full border-brand-red text-brand-red hover:bg-brand-red/5 rounded-full group-hover:bg-brand-red group-hover:text-white transition-all"
                      >
                        Read Article <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-32 bg-brand-dark text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">Stay Updated</h2>
              <p className="text-xl text-white/40 mb-12 leading-relaxed">
                Get the latest articles, tutorials, and product updates delivered to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
                />
                <Button className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_24px_48px_-12px_rgba(217,66,37,0.3)] whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
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
