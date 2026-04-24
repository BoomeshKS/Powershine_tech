import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Star, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Truck, 
  CreditCard, 
  AlertCircle,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Trash2,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Supplier } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function SupplierManager() {
  const { suppliers } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">Supplier Ecosystem</h1>
          <p className="text-slate-400 mt-2 font-medium">Strategic sourcing and procurement partner network management.</p>
        </div>
        <button className="bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 group">
          <Plus size={20} /> Onboard Partner
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Partner Index (Name, Category, Product Tags)..." 
            className="w-full glass border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-primary/50 transition-all font-bold placeholder:text-slate-700 uppercase mb-0 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
           <button 
             onClick={() => setViewMode('grid')}
             className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white')}
           >
             Grid View
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white')}
           >
             List View
           </button>
        </div>
      </div>

      <div className={cn("grid gap-6", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
        <AnimatePresence mode="popLayout">
          {filteredSuppliers.map((supplier) => (
            <motion.div 
              key={supplier.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-8 rounded-[3rem] border-white/5 hover:border-primary/20 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-6">
                 <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:scale-110 transition-transform duration-500">
                       <Building2 size={32} />
                    </div>
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={14} className={cn(i < supplier.rating ? "text-amber-400 fill-amber-400" : "text-slate-700")} />
                       ))}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-xl font-display font-bold text-white tracking-tight uppercase group-hover:text-primary transition-colors">{supplier.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest">{supplier.category}</span>
                       </div>
                       <span className={cn("text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest", supplier.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-slate-500 bg-slate-500/10 border-slate-500/20')}>
                         {supplier.status}
                       </span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Lead Cycle</p>
                       <p className="text-white font-bold inline-flex items-center gap-2"><Truck size={14} className="text-primary" /> {supplier.lead} Days</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Payment Terms</p>
                       <p className="text-white font-bold inline-flex items-center gap-2"><CreditCard size={14} className="text-blue-400" /> {supplier.terms}</p>
                    </div>
                 </div>

                 <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer group/link">
                       <Mail size={14} />
                       <span className="text-xs font-bold uppercase truncate">{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer group/link">
                       <Phone size={14} />
                       <span className="text-xs font-bold uppercase">{supplier.phone}</span>
                    </div>
                 </div>
              </div>

              <div className="pt-8 flex gap-3">
                 <button className="flex-1 bg-white/5 hover:bg-primary hover:text-white text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                   Engagement History
                 </button>
                 <button className="w-14 h-14 bg-white/5 hover:bg-red-400/10 text-slate-500 hover:text-red-400 rounded-2xl flex items-center justify-center transition-all border border-white/5">
                   <Trash2 size={20} />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
