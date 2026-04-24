import React from 'react';
import { motion } from 'motion/react';
import { BUSINESS_INFO } from '../constants';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-primary font-display font-bold tracking-widest uppercase text-sm"
              >
                About Powershine Tech
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-display font-bold leading-tight"
              >
                India's Most Trusted <span className="text-primary">Industrial Electronics</span> Specialist
              </motion.h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 text-slate-400 text-lg leading-relaxed"
            >
              <p>
                Welcome to PowerShine Tech. We are a leading electronics industry service and sales company for LCD, PLC, HMI, VFD, sensor, and other industrial equipment.
              </p>
              <p>
                Headquartered in Tiruppur, Tamil Nadu, we specialise in component-level repair of circuit boards across a wide range of industries. We manufacture customised PCB-level sensors and undertake R&D projects tailored to your industrial needs.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {["15+ Years Field Experience", "Microscope-Level Precision", "24-48 Hour Turnaround", "6-Month Service Warranty", "PCB Reverse Engineering", "Pan-India Doorstep Service"].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                >
                  <FeatureItem text={text} />
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <button className="group flex items-center gap-3 text-white font-bold text-lg hover:text-primary transition-colors">
                Learn Our Full Story <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Visuals */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-auto lg:h-[600px] neon-glow-primary parallax-float">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" 
                alt="PCB Repair Lab"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl hidden md:block max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-white">{BUSINESS_INFO.founder}</h4>
                  <p className="text-xs text-slate-400">Founder & Director</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 italic">
                "Our mission is to provide world-class industrial electronics repair at a fraction of the OEM replacement cost."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="text-primary" size={20} />
      <span className="text-slate-300 font-medium">{text}</span>
    </div>
  );
}
