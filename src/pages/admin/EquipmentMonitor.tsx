import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Plus, 
  MapPin, 
  Cpu, 
  AlertTriangle, 
  ArrowUpRight,
  ShieldCheck,
  Settings2,
  Trash2,
  X,
  Radio,
  Timer
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Equipment } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function EquipmentMonitor() {
  const { equipment, updateEquipmentStatus } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipment = equipment.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusConfig = (status: Equipment['status']) => {
    switch (status) {
      case 'Online': return { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: Radio, text: 'Signal Active' };
      case 'Offline': return { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: X, text: 'Disconnected' };
      case 'Warning': return { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: AlertTriangle, text: 'Critical Alert' };
      case 'Maintenance': return { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Settings2, text: 'Servicing' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">Infrastructure Sync</h1>
          <p className="text-slate-400 mt-2 font-medium">Real-time status and diagnostic telemetry for field hardware.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-primary/20 group"
        >
          <div className="p-1 bg-white/20 rounded-md group-hover:rotate-180 transition-transform duration-500">
            <Plus size={16} />
          </div>
          Register Node
        </button>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Network Health', value: '98.2%', color: 'text-emerald-400', icon: Activity },
           { label: 'Active Nodes', value: equipment.filter(e => e.status === 'Online').length, color: 'text-blue-400', icon: Cpu },
           { label: 'Maintenance Gap', value: '4d 12h', color: 'text-amber-400', icon: Timer },
           { label: 'Incident Index', value: '02', color: 'text-red-400', icon: AlertTriangle },
         ].map((stat, i) => (
           <div key={i} className="glass p-6 rounded-[2rem] border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                 <stat.icon size={18} className={stat.color} />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">{stat.label}</p>
              </div>
              <p className={cn("text-3xl font-display font-bold tracking-tighter", stat.color)}>{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="glass p-4 rounded-3xl border-white/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Index Registry Search (Node ID, Serial, Location)..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-primary/50 transition-all font-bold placeholder:text-slate-700 uppercase text-xs tracking-wider"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEquipment.map((item) => {
            const config = getStatusConfig(item.status);
            const StatusIcon = config.icon;
            return (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass group rounded-[2.5rem] border-white/5 overflow-hidden hover:border-primary/20 transition-all duration-500"
              >
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-white/5 rounded-3xl group-hover:bg-primary/10 transition-colors duration-500">
                      <Cpu size={24} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className={cn("px-4 py-2 rounded-2xl border flex items-center gap-2", config.color)}>
                      <StatusIcon size={14} className={cn(item.status === 'Online' && "animate-pulse")} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{config.text}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-white tracking-tight uppercase group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Serial: {item.serial}</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/5 group-hover:text-amber-400 group-hover:border-amber-400/20 transition-all">
                          <MapPin size={14} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sync Location</p>
                          <p className="text-white text-xs font-bold uppercase">{item.location}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/5 group-hover:text-blue-400 group-hover:border-blue-400/20 transition-all">
                          <ShieldCheck size={14} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Last Maintenance</p>
                          <p className="text-white text-xs font-bold uppercase">{item.lastMaint}</p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <button 
                      onClick={() => updateEquipmentStatus(item.id, item.status === 'Online' ? 'Offline' : 'Online')}
                      className="bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Radio size={12} /> Sync
                    </button>
                    <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <ArrowUpRight size={12} /> Console
                    </button>
                  </div>
                </div>
                {item.status === 'Warning' && (
                   <div className="bg-amber-400/10 border-t border-amber-400/20 p-4 flex items-center gap-3">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest leading-relaxed">
                        Voltage Threshold Violation detected on Sensor Array B. Intervention Required.
                      </p>
                   </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredEquipment.length === 0 && (
         <div className="py-24 text-center glass rounded-[3rem] border-white/5 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-white/10">
               <Activity size={40} className="text-slate-700" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase mb-2">Registry Mismatch</h3>
            <p className="text-slate-500 font-medium px-8 leading-relaxed mb-8">
              The requested node ID or serial index does not exist in the current telemetry cluster. Verify the search parameters and try again.
            </p>
            <button 
               onClick={() => setSearchQuery('')}
               className="text-primary text-xs font-black uppercase tracking-widest px-8 py-3 bg-primary/5 rounded-full border border-primary/20 hover:bg-primary hover:text-white transition-all"
            >
               Flush Filters
            </button>
         </div>
      )}
    </div>
  );
}
