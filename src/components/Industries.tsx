import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { INDUSTRIES } from '../constants';

export default function Industries() {
  return (
    <section id="industries" className="py-24 bg-dark-card relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-accent-light/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Industries We <span className="text-primary-green">Serve</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Providing specialized electronic solutions across a diverse range of industrial sectors.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {INDUSTRIES.map((industry, index) => {
            const IconComponent = (Icons as any)[industry.icon] || Icons.Factory;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary-green/50 transition-all duration-500 text-center"
              >
                <div className="mb-6 inline-block p-4 rounded-full bg-primary-green/10 text-primary-green group-hover:bg-primary-green group-hover:text-dark-bg transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,255,157,0.4)]">
                  <IconComponent size={32} />
                </div>
                <h3 className="text-white font-bold group-hover:text-primary-green transition-colors">
                  {industry.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
