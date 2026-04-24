import React from 'react';
import { motion } from 'motion/react';
import { BUSINESS_INFO } from '../constants';
import { Zap, Facebook, Instagram, Youtube, Linkedin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-white/5 pt-20 pb-10 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative h-12 flex items-center">
                <img 
                  src="/26472logo.png" 
                  alt="Powershine Tech" 
                  className="h-full w-auto object-contain transition-transform group-hover:scale-105"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leading industrial electronics service and manufacturing company. Specialising in PCB repair, PLC, HMI, VFD, and automation.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Youtube size={18} />} />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-white font-display font-bold uppercase tracking-widest text-sm">Our Services</h4>
            <ul className="space-y-3">
              <FooterLink>PCB Repair & Rework</FooterLink>
              <FooterLink>PLC Programming</FooterLink>
              <FooterLink>VFD Drive Repair</FooterLink>
              <FooterLink>HMI Panel Design</FooterLink>
              <FooterLink>PCB Cloning</FooterLink>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-display font-bold uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink>About Us</FooterLink>
              <FooterLink>Product Catalog</FooterLink>
              <FooterLink>Gallery</FooterLink>
              <FooterLink>Contact Us</FooterLink>
              <FooterLink>IndiaMart Profile</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-display font-bold uppercase tracking-widest text-sm">Contact Info</h4>
            <div className="space-y-4 text-sm text-slate-400">
              <p className="leading-relaxed">{BUSINESS_INFO.address}</p>
              <p className="text-white font-bold">{BUSINESS_INFO.phone}</p>
              <p>{BUSINESS_INFO.email}</p>
            </div>
            <a 
              href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-2 text-[#25D366] font-bold text-sm hover:gap-3 transition-all"
            >
              WHATSAPP US <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <p>© 2026 {BUSINESS_INFO.name}. All Rights Reserved. | {BUSINESS_INFO.founder}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <a href="#" className="text-sm text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
        <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        {children}
      </a>
    </li>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
      {icon}
    </a>
  );
}
