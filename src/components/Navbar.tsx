import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  Globe, 
  Menu, 
  X, 
  ChevronDown, 
  Download, 
  Moon,
  Sun,
  LayoutGrid,
  Settings,
  Zap,
  Activity,
  Layers,
  Cpu,
  Factory,
  Utensils,
  Stethoscope,
  FlaskConical,
  Package,
  Mic,
  ArrowRight
} from 'lucide-react';
import { BUSINESS_INFO, MEGA_MENU_DATA } from '../constants';
import { cn } from '../lib/utils';

const ICON_MAP: Record<string, any> = {
  Monitor: LayoutGrid,
  Cpu: Cpu,
  Zap: Zap,
  Activity: Activity,
  Layers: Layers,
  Microscope: Settings,
  Factory: Factory,
  Utensils: Utensils,
  Stethoscope: Stethoscope,
  FlaskConical: FlaskConical,
  Package: Package
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Initialize theme state from document attribute
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDarkMode(currentTheme !== 'light');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000]">
      {/* Top Bar */}
      <div className="hidden lg:flex bg-black/80 border-b border-white/5 py-2 px-6 justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail size={14} /> {BUSINESS_INFO.email}
          </a>
          <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone size={14} /> {BUSINESS_INFO.phone}
          </a>
          <span className="flex items-center gap-2">
            <Globe size={14} /> {BUSINESS_INFO.website}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neon-green">● Factory Live</span>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <button className="hover:text-white transition-colors">EN</button>
            <span className="text-white/20">|</span>
            <button className="hover:text-white transition-colors">தமிழ்</button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={cn(
        "transition-all duration-300 px-6 py-4 flex items-center justify-between",
        isScrolled ? "glass-dark py-3" : "bg-transparent"
      )}>
        {/* Logo */}
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

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <NavLink href="#home">Home</NavLink>
          <NavLink href="#about">About Us</NavLink>
          
          {/* Products Mega Menu Trigger */}
          <div 
            className="relative group py-4"
            onMouseEnter={() => setActiveDropdown('products')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-primary transition-colors cursor-default">
              Products & Services <ChevronDown size={14} className={cn("transition-transform duration-300", activeDropdown === 'products' && "rotate-180")} />
            </button>
            
            {/* Mega Menu */}
            <AnimatePresence>
              {activeDropdown === 'products' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] glass-dark p-8 rounded-[2rem] border-white/10 shadow-2xl mt-4"
                >
                  <div className="grid grid-cols-3 gap-10">
                    {MEGA_MENU_DATA.products.map((section) => {
                      const Icon = ICON_MAP[section.icon] || LayoutGrid;
                      return (
                        <div key={section.title} className="space-y-4">
                          <div className="flex items-center gap-3 text-primary">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon size={20} />
                            </div>
                            <h4 className="font-display font-bold text-base uppercase tracking-wider">{section.title}</h4>
                          </div>
                          <ul className="space-y-3">
                            {section.items.map(item => (
                              <li key={item}>
                                <a 
                                  href="/products" 
                                  className="text-[13px] text-slate-400 hover:text-white transition-all flex items-center gap-2 group/item"
                                >
                                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover/item:opacity-100 transition-all -ml-3 group-hover:ml-0" />
                                  {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer of Mega Menu */}
                  <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center text-xs">
                    <p className="text-slate-500">All modules are high industrial grade and ISO certified.</p>
                    <a href="/products" className="text-primary font-bold hover:underline flex items-center gap-1">
                      View All Electronics <ArrowRight size={14} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href="#gallery">Gallery</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors">
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 neon-glow-primary">
            <Download size={16} /> Brochure
          </button>
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-dark-bg z-[999] lg:hidden flex flex-col p-8 pt-24"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-medium">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
              <a href="#products" onClick={() => setIsMobileMenuOpen(false)}>Products</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </div>
            <div className="mt-auto space-y-6">
              <div className="flex flex-col gap-2 text-slate-400">
                <p className="flex items-center gap-2"><Phone size={18} /> {BUSINESS_INFO.phone}</p>
                <p className="flex items-center gap-2"><Mail size={18} /> {BUSINESS_INFO.email}</p>
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg">
                Download Brochure
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-sm font-medium text-slate-300 hover:text-primary transition-colors relative group py-2"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
    </a>
  );
}
