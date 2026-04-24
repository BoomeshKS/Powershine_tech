import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User as UserIcon, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Zap,
  Moon,
  Sun,
  Bell,
  LogOut,
  Package,
  Mic,
  ChevronDown,
  LayoutGrid,
  Settings,
  Cpu,
  Activity,
  Factory,
  Stethoscope,
  FlaskConical,
  Beaker,
  Layers,
  Utensils
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { MEGA_MENU_DATA } from '../constants';

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

export default function UserLayout() {
  const { user, logout } = useAuth();
  const { cart, wishlist, notifications, markNotificationRead, products } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadCount = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  const filteredProducts = searchQuery 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice search not supported in this browser');
      return;
    }
    
    // @ts-ignore
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    
    toast.success('Listening...');
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsSearchOpen(true);
    };
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Navbar */}
      <header className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-all duration-300 px-6 py-4 flex items-center justify-between",
        isScrolled ? "glass py-3 shadow-lg" : "bg-transparent"
      )}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-12 flex items-center">
            <img 
              src="/26472logo.png" 
              alt="Powershine Tech" 
              className={cn(
                "h-full w-auto object-contain transition-transform group-hover:scale-105",
                !isDarkMode && isScrolled ? "invert brightness-0" : ""
              )}
              style={isDarkMode || !isScrolled ? { mixBlendMode: 'screen' } : {}}
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          
          {/* Products & Services Mega Menu */}
          <div 
            className="relative group"
            onMouseEnter={() => setActiveMegaMenu('products')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-primary transition-colors py-2">
              Products & Services
              <ChevronDown size={14} className={cn("transition-transform", activeMegaMenu === 'products' && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {activeMegaMenu === 'products' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] mt-2 glass-dark border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-8">
                    {MEGA_MENU_DATA.products.map((section) => {
                      const Icon = ICON_MAP[section.icon] || LayoutGrid;
                      return (
                        <div key={section.title} className="space-y-4">
                          <div className="flex items-center gap-2 text-primary">
                            <Icon size={18} />
                            <h4 className="font-bold text-sm uppercase tracking-wider">{section.title}</h4>
                          </div>
                          <ul className="space-y-2">
                            {section.items.map(item => (
                              <li key={item}>
                                <Link 
                                  to={`/products?q=${item}`}
                                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group/item"
                                >
                                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Industries Served Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setActiveMegaMenu('industries')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-primary transition-colors py-2">
              Industries Served
              <ChevronDown size={14} className={cn("transition-transform", activeMegaMenu === 'industries' && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {activeMegaMenu === 'industries' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-64 mt-2 glass-dark border border-white/10 rounded-2xl p-4 shadow-2xl"
                >
                  <div className="space-y-2">
                    {MEGA_MENU_DATA.industries.map((industry) => {
                      const Icon = ICON_MAP[industry.icon] || Factory;
                      return (
                        <Link 
                          key={industry.name}
                          to={`/products?industry=${industry.name}`}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group/ind"
                        >
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/ind:bg-primary group-hover/ind:text-dark-bg transition-colors">
                            <Icon size={16} />
                          </div>
                          <span className="text-sm font-medium">{industry.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/orders">My Orders</NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className={cn(
              "flex items-center border rounded-full px-4 py-2 transition-all",
              isScrolled 
                ? "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-within:border-primary" 
                : "bg-white/10 border-white/20 focus-within:border-white"
            )}>
              <Search size={18} className={cn(isScrolled && !isDarkMode ? "text-slate-500" : "text-slate-400")} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className={cn(
                  "bg-transparent border-none outline-none text-sm px-3 w-48 lg:w-64",
                  isScrolled && !isDarkMode ? "text-slate-900 placeholder:text-slate-500" : "text-white"
                )}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              <button onClick={handleVoiceSearch} className="text-slate-400 hover:text-primary transition-colors">
                <Mic size={16} />
              </button>
            </div>

            {isSearchOpen && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
                ) : (
                  filteredProducts.map(p => (
                    <Link 
                      key={p.id} 
                      to={`/product/${p.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{p.name}</p>
                        <p className="text-xs text-primary mt-1">₹{p.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <button onClick={toggleTheme} className={cn("p-2 transition-colors", isScrolled && !isDarkMode ? "text-slate-600 hover:text-primary" : "text-slate-400 hover:text-white")}>
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={cn("p-2 relative transition-colors", isScrolled && !isDarkMode ? "text-slate-600 hover:text-primary" : "text-slate-400 hover:text-white")}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 glass-dark rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                      <h4 className="font-bold text-white">Notifications</h4>
                      <button className="text-xs text-primary hover:underline">Mark all as read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.filter(n => n.userId === user?.id).length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No notifications</div>
                      ) : (
                        notifications
                          .filter(n => n.userId === user?.id)
                          .map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => markNotificationRead(n.id)}
                              className={cn(
                                "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors",
                                !n.isRead && "bg-primary/5"
                              )}
                            >
                              <p className="text-sm text-slate-300">{n.message}</p>
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                {new Date(n.date).toLocaleString()}
                                </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{user.email}</p>
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest rounded-full mt-1">
                    {user.role}
                  </span>
                </div>
                <Link to="/profile" className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold hover:scale-105 transition-transform">
                  {user.name[0]}
                </Link>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold neon-glow-primary hover:scale-105 transition-transform">
              Login
            </Link>
          )}

          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-dark-bg z-[99] lg:hidden flex flex-col p-8 pt-24 overflow-y-auto">
          <nav className="flex flex-col gap-6 text-2xl font-display">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
          </nav>
          <div className="mt-auto pt-8">
            {user ? (
              <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-xl font-bold">
                <LogOut size={20} /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-center">
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-24">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      {location.pathname !== '/' && (
        <footer className="bg-dark-card border-t border-white/5 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
              <div className="space-y-6">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="relative h-12 flex items-center">
                    <img 
                      src="/26472logo.png" 
                      alt="Powershine Tech" 
                      className="h-full w-auto object-contain transition-transform group-hover:scale-105"
                      style={{ mixBlendMode: 'screen' }}
                    />
                  </div>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Leading industrial electronics service and manufacturing company. Specialising in PCB repair, PLC, HMI, VFD, and automation.
                </p>
              </div>
              <div>
                <h4 className="text-white font-display font-bold mb-6">Quick Links</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
                  <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
                  <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-display font-bold mb-6">Customer Service</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-primary transition-colors">Shipping Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-display font-bold mb-6">Newsletter</h4>
                <p className="text-slate-400 text-sm mb-4">Subscribe to get latest updates and offers.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full outline-none focus:border-primary" />
                  <button className="bg-primary text-white p-2 rounded-lg neon-glow-primary"><Zap size={18} /></button>
                </div>
              </div>
            </div>
            <div className="pt-10 border-t border-white/5 text-center text-slate-500 text-xs">
              © 2026 Powershine Tech. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={cn(
        "text-sm font-medium transition-colors relative group py-2",
        isActive ? "text-primary" : "text-slate-300 hover:text-primary"
      )}
    >
      {children}
      <span className={cn(
        "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
        isActive ? "w-full" : "w-0 group-hover:w-full"
      )} />
    </Link>
  );
}
