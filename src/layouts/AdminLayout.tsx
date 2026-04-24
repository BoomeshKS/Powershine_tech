import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  Zap,
  Moon,
  Sun,
  ChevronRight,
  Home,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  const coreItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  const industrialItems = [
    { name: 'RFQ / Quotations', path: '/admin/rfq', icon: Zap },
    { name: 'Equipment Monitor', path: '/admin/equipment', icon: Zap },
    { name: 'Warranty Tracker', path: '/admin/warranty', icon: Zap },
    { name: 'Service Tickets', path: '/admin/service', icon: Zap },
    { name: 'Suppliers', path: '/admin/suppliers', icon: Users },
  ];

  const peopleItems = [
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'CRM Profile', path: '/admin/profile', icon: User },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Helper to generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    
    return { name: displayName, path: routeTo, isLast };
  });

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-white/5 transition-transform duration-300 lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative h-10 flex items-center">
                <img 
                  src="/26472logo.png" 
                  alt="Powershine Tech" 
                  className="h-full w-auto object-contain transition-transform group-hover:scale-105"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
            </Link>
            <span className="inline-block w-fit px-2 py-0.5 bg-primary-green/10 text-primary-green text-[8px] font-bold uppercase tracking-widest rounded-full">
              ADMIN PANEL
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
            <div>
              <p className="px-4 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-4">Core</p>
              <div className="space-y-1">
                {coreItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                      location.pathname === item.path 
                        ? "bg-primary text-white neon-glow-primary shadow-lg shadow-primary/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon size={18} className={cn(location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-primary transition-colors")} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-4">Industrial</p>
              <div className="space-y-1">
                {industrialItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                      location.pathname === item.path 
                        ? "bg-primary text-white neon-glow-primary shadow-lg shadow-primary/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon size={18} className={cn(location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-primary transition-colors")} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-4">People</p>
              <div className="space-y-1">
                {peopleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                      location.pathname === item.path 
                        ? "bg-primary text-white neon-glow-primary shadow-lg shadow-primary/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon size={18} className={cn(location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-primary transition-colors")} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-dark-card border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-400 hover:text-white relative"
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
                <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                <p className="text-[10px] text-slate-500 mt-1">{user?.email}</p>
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest rounded-full mt-1">
                  {user?.role}
                </span>
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                {user?.name[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-6 text-xs font-medium">
            <Link 
              to="/admin/dashboard" 
              className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Home size={14} />
              <span>Admin</span>
            </Link>
            {breadcrumbs.length > 0 && <ChevronRight size={14} className="text-slate-700" />}
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.path}>
                {crumb.isLast ? (
                  <span className="text-white px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                    {crumb.name}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link 
                      to={crumb.path} 
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      {crumb.name}
                    </Link>
                    {idx < breadcrumbs.length - 1 && (
                      <ChevronRight size={14} className="text-slate-700" />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
