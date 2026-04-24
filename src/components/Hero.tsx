import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion, useScroll, useTransform } from 'motion/react';
import { Zap, ArrowRight, Shield, Settings, Microscope } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SLIDES = [
  {
    badge: "Established 2020 | Tiruppur",
    title: "Powering Industrial Innovation with Smart Electronics",
    subtitle: "Leading specialists in PCB Repair, PLC Automation, and Industrial Electronics across Tamil Nadu.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1920",
    icon: <Zap className="text-primary" size={40} />
  },
  {
    badge: "Precision Repair Services",
    title: "PCB Reverse Engineering & Cloning Specialists",
    subtitle: "We manufacture, clone, and repair all types of circuit boards with microscope-level precision.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920",
    icon: <Microscope className="text-accent" size={40} />
  },
  {
    badge: "Automation Experts",
    title: "Complete PLC & HMI Automation Solutions",
    subtitle: "Design, programming, and repair of industrial control systems for all major brands.",
    image: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=1920",
    icon: <Settings className="text-neon-green" size={40} />
  }
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={containerRef} className="relative h-screen min-h-[700px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full flex items-center px-6 lg:px-20">
              {/* Background Image with Parallax */}
              <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                  loading={index === 0 ? "eager" : "lazy"}
                  {...({ fetchPriority: index === 0 ? "high" : "low" } as any)}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
                <div className="absolute inset-0 bg-dark-bg/40" />
              </motion.div>

              {/* Content with Parallax */}
              <motion.div style={{ y: contentY, opacity }} className="relative z-10 max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-primary/20 text-primary text-sm font-bold tracking-wider uppercase">
                    {slide.icon}
                    {slide.badge}
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] tracking-tight">
                    {slide.title}
                  </h1>
                  
                  <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 neon-glow-primary">
                      Enquire Now <ArrowRight size={20} />
                    </button>
                    <button className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
                      Our Services
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating Stats Bar */}
      <div className="absolute bottom-0 left-0 w-full z-20 glass-dark border-t border-white/5 py-6 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <TrustItem icon={<Shield size={20} />} text="Established 2020" />
          <TrustItem icon={<Zap size={20} />} text="24hr Rapid Repair" />
          <TrustItem icon={<Microscope size={20} />} text="PCB Cloning Experts" />
          <TrustItem icon={<Settings size={20} />} text="Pan-India Delivery" />
          <div className="flex items-center gap-2 text-primary font-bold">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            LIVE SUPPORT AVAILABLE
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300 font-medium">
      <div className="text-primary">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
