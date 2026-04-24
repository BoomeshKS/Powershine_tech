import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';
import { cn } from '../lib/utils';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-dark-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-primary font-display font-bold tracking-widest uppercase text-sm"
              >
                Get In Touch
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-display font-bold"
              >
                Ready to Start Your <span className="text-primary">Project?</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-lg max-w-md"
              >
                Contact our expert engineers today for a free consultation and quote on your industrial electronics needs.
              </motion.p>
            </div>

            <div className="space-y-8">
      {[
        { icon: <Phone size={24} />, title: "Call Us Directly", value: BUSINESS_INFO.phone, link: `tel:${BUSINESS_INFO.phone}`, colorClass: "text-[#22c55e]" },
        { icon: <Mail size={24} />, title: "Email Our Team", value: BUSINESS_INFO.email, link: `mailto:${BUSINESS_INFO.email}`, colorClass: "text-[#7d2ae8]" },
        { icon: <MapPin size={24} />, title: "Visit Our Workshop", value: BUSINESS_INFO.address, link: "https://maps.google.com/?q=Powershine+Tech+Tiruppur", colorClass: "text-primary" }
      ].map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + (i * 0.1) }}
        >
          <ContactItem {...item} />
        </motion.div>
      ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4"
            >
              <a 
                href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-3 bg-neon-green/10 text-neon-green px-6 py-4 rounded-2xl font-bold hover:bg-neon-green hover:text-white transition-all"
              >
                <MessageSquare size={20} /> WhatsApp Us
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass p-10 rounded-[2.5rem] border-white/5"
          >
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Required</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary outline-none transition-all appearance-none">
                  <option>PCB Repair</option>
                  <option>PLC Automation</option>
                  <option>VFD Drive Repair</option>
                  <option>HMI Services</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary outline-none transition-all resize-none"></textarea>
              </div>

              <button className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] neon-glow-primary">
                Send Enquiry <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, title, value, link, colorClass }: { icon: React.ReactNode; title: string; value: string; link: string; colorClass: string }) {
  return (
    <a href={link} className="flex items-start gap-6 group">
      <div className={cn(
        "w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center transition-all duration-300",
        "group-hover:bg-white/10 group-hover:scale-110",
        colorClass
      )}>
        {icon}
      </div>
      <div>
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-white font-medium group-hover:text-primary transition-colors leading-relaxed">{value}</p>
      </div>
    </a>
  );
}
