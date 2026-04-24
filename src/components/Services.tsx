import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { SERVICES } from '../constants';

const categories = ['All', 'Repair', 'Automation', 'Manufacturing', 'Medical'];

export default function Services() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredServices = activeFilter === 'All' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeFilter);

  return (
    <section id="services" className="py-24 bg-dark-bg relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-light/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Our <span className="text-primary-green">Expertise</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Comprehensive industrial electronic solutions, from precision repairs to custom manufacturing and advanced automation.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-primary-green border-primary-green text-dark-bg font-bold shadow-[0_0_20px_rgba(0,255,157,0.4)]'
                  : 'border-white/10 text-gray-400 hover:border-primary-green/50 hover:text-primary-green'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => {
              const IconComponent = (Icons as any)[service.icon] || Icons.Settings;
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="h-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary-green/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-px bg-gradient-to-br from-primary-green/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="mb-6 inline-block p-4 rounded-xl bg-primary-green/10 text-primary-green group-hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all duration-500 group-hover:rotate-[360deg]">
                        <IconComponent size={32} />
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-primary-green font-bold px-2 py-1 rounded bg-primary-green/10 border border-primary-green/20">
                          {service.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-green transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <a 
                        href="#contact" 
                        className="inline-flex items-center text-primary-green text-sm font-bold hover:gap-2 transition-all"
                      >
                        Learn More <Icons.ArrowRight size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
