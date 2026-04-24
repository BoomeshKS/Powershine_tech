import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  History,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Warranty } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function WarrantyTracker() {
  const { warranties } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWarranties = warranties.filter(w => 
    w.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getWarrantyStatus = (end: string) => {
    const today = new Date();
    const endDate = new Date(end);
    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: ShieldAlert };
    if (diffDays <= 60) return { label: 'Expiring Soon', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: AlertCircle, days: diffDays };
    return { label: 'Fully Protected', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: ShieldCheck };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">Coverage Registry</h1>
          <p className="text-slate-400 mt-2 font-medium">Tracking liability and service guarantees for industrial installations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Register Coverage
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="xl:col-span-3 space-y-6">
          <div className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Lookup by Identity Code, Product, or Client..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-primary/50 transition-all font-bold placeholder:text-slate-700 uppercase text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3 shrink-0">
               <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Filter: All Coverage</button>
               <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Sort: Deadline</button>
            </div>
          </div>

          <div className="glass rounded-[3rem] border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                  <tr>
                    <th className="px-10 py-6">Asset Intelligence</th>
                    <th className="px-6 py-6">Responsible Client</th>
                    <th className="px-6 py-6">Protected Period</th>
                    <th className="px-6 py-6">Risk Factor</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredWarranties.map((w) => {
                    const status = getWarrantyStatus(w.end);
                    const StatusIcon = status.icon;
                    return (
                      <tr key={w.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <ShieldCheck size={24} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-white uppercase group-hover:text-primary transition-colors">{w.product}</p>
                               <span className="text-[10px] font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">ID: {w.serial}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-8">
                           <p className="text-white text-xs font-bold uppercase tracking-tight">{w.customer}</p>
                           <p className="text-[10px] text-slate-600 font-medium mt-1 uppercase">Industrial Entity</p>
                        </td>
                        <td className="px-6 py-8">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2 text-white font-bold text-xs">
                                 <Calendar size={12} className="text-primary" /> {w.start}
                              </div>
                              <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase">
                                 <ArrowRight size={12} /> {w.end}
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-8">
                           <div className={cn("px-4 py-1.5 rounded-full border inline-flex items-center gap-2 whitespace-nowrap", status.color)}>
                              <StatusIcon size={12} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3 translate-x-4 group-hover:translate-x-0 transition-transform">
                              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"><ExternalLink size={16} /></button>
                              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all"><History size={16} /></button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="glass p-8 rounded-[3rem] border-white/5 space-y-8">
              <div>
                 <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-2">
                    <Clock size={20} className="text-amber-400" /> Imminent Risks
                 </h3>
                 <p className="text-slate-500 text-xs font-medium">Entities losing protection within 60 diagnostic cycles.</p>
              </div>

              <div className="space-y-5">
                 {filteredWarranties.filter(w => {
                    const diff = Math.ceil((new Date(w.end).getTime() - new Date().getTime()) / (1000*60*60*24));
                    return diff >= 0 && diff <= 60;
                 }).map(w => (
                    <div key={w.id} className="p-5 bg-amber-400/[0.03] rounded-[2rem] border border-amber-400/10 space-y-3 relative overflow-hidden group hover:border-amber-400/30 transition-all">
                       <div className="absolute top-0 left-0 w-1 h-full bg-amber-400/50" />
                       <p className="text-xs font-black text-white uppercase truncate">{w.product}</p>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-amber-500/80 uppercase">Losing Protection in:</span>
                          <span className="text-sm font-display font-black text-amber-500">
                             {Math.ceil((new Date(w.end).getTime() - new Date().getTime()) / (1000*60*60*24))}D
                          </span>
                       </div>
                       <button className="w-full py-2.5 bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Issue Renewal</button>
                    </div>
                 ))}
                 {filteredWarranties.filter(w => {
                    const diff = Math.ceil((new Date(w.end).getTime() - new Date().getTime()) / (1000*60*60*24));
                    return diff >= 0 && diff <= 60;
                 }).length === 0 && (
                    <div className="p-8 text-center bg-white/[0.01] rounded-[2rem] border border-white/5 border-dashed">
                       <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-3" />
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">No protection gaps detected for the current operational cycle.</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="p-8 bg-blue-500/10 rounded-[3rem] border border-blue-500/20 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Claims Efficiency</p>
              <div className="flex items-baseline gap-2 font-display">
                 <span className="text-4xl font-black text-white leading-none">94%</span>
                 <span className="text-xs font-bold text-blue-400 tracking-widest">STABLE</span>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">94% of warranty claims resolved within standard hardware diagnostic periods.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
