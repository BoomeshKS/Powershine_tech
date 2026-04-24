import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Cpu, 
  ChevronRight,
  Filter,
  MessageSquare,
  Paperclip,
  Calendar,
  X,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Ticket } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const COLUMN_COLORS = {
  'Open': 'border-red-500/20 bg-red-500/5',
  'In Progress': 'border-amber-500/20 bg-amber-500/5',
  'Closed': 'border-emerald-500/20 bg-emerald-500/5'
};

const PRIORITY_COLORS = {
  'Critical': 'text-red-400 bg-red-400/10 border-red-400/20',
  'High': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Medium': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Low': 'text-slate-400 bg-slate-400/10 border-slate-400/20'
};

export default function ServiceTickets() {
  const { tickets, updateTicketStatus, addTicket } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const columns: Ticket['status'][] = ['Open', 'In Progress', 'Closed'];

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.equip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-1">
        <div>
           <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
               <Zap size={20} />
             </div>
             <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">Service Kanban</h1>
           </div>
           <p className="text-slate-400 mt-2 font-medium">Monitoring field service requests and maintenance pipeline acceleration.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-primary/30"
        >
          <Plus size={18} /> Deploy Ticket
        </button>
      </div>

      <div className="glass p-4 rounded-[2rem] border-white/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Incident Index (Title, ID, Hardware)..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white outline-none focus:border-primary/50 transition-all font-bold placeholder:text-slate-700 uppercase mb-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="h-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-3">
           <Filter size={16} /> Filters
        </button>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-8">
        <div className="flex gap-8 min-h-[600px] h-full">
          {columns.map((status) => (
            <div key={status} className={cn("flex-1 min-w-[340px] rounded-[3rem] border border-white/5 flex flex-col", COLUMN_COLORS[status])}>
              <div className="p-8 pb-4 flex justify-between items-center bg-white/[0.02] border-b border-white/5 rounded-t-[3rem]">
                <div className="flex items-center gap-3">
                   <div className={cn("w-3 h-3 rounded-full", status === 'Open' ? 'bg-red-500' : status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500')} />
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">{status}</h3>
                </div>
                <span className="text-xs font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  {filteredTickets.filter(t => t.status === status).length}
                </span>
              </div>

              <div className="flex-1 p-6 space-y-5 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredTickets.filter(t => t.status === status).map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass p-6 rounded-[2.5rem] border-white/5 hover:border-white/10 group cursor-grab active:cursor-grabbing hover:bg-white/[0.03] transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                           <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", PRIORITY_COLORS[ticket.priority])}>
                             {ticket.priority}
                           </span>
                           <button className="p-1 text-slate-600 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                        </div>

                        <div>
                           <h4 className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors">{ticket.title}</h4>
                           <div className="flex items-center gap-2 mt-2">
                             <Cpu size={12} className="text-slate-500" />
                             <span className="text-[10px] font-bold text-slate-500 uppercase">{ticket.equip}</span>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                           <div className="flex items-center gap-2">
                              {ticket.assign ? (
                                <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black">
                                     {ticket.assign[0]}
                                   </div>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{ticket.assign}</span>
                                </div>
                              ) : (
                                <span className="text-[9px] font-black text-red-500/80 uppercase tracking-widest bg-red-400/5 px-2 py-1 rounded border border-red-400/10">Unassigned</span>
                              )}
                           </div>
                           <div className="flex items-center gap-3 text-slate-600">
                              <div className="flex items-center gap-1"><MessageSquare size={12} /><span className="text-[10px] font-bold">2</span></div>
                              <div className="flex items-center gap-1"><Paperclip size={12} /><span className="text-[10px] font-bold">1</span></div>
                           </div>
                        </div>

                        <div className="pt-4 flex justify-between items-center border-t border-white/5">
                           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{ticket.id}</span>
                           <div className="flex gap-2">
                              {status !== 'Open' && (
                                <button 
                                  onClick={() => updateTicketStatus(ticket.id, status === 'Closed' ? 'In Progress' : 'Open')}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-500 transition-all"
                                >
                                  <ChevronRight size={14} className="rotate-180" />
                                </button>
                              )}
                              {status !== 'Closed' && (
                                <button 
                                  onClick={() => updateTicketStatus(ticket.id, status === 'Open' ? 'In Progress' : 'Closed')}
                                  className="p-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-all"
                                >
                                  <ChevronRight size={14} />
                                </button>
                              )}
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredTickets.filter(t => t.status === status).length === 0 && (
                   <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-white/10">
                        <CheckCircle2 size={24} className="text-slate-700" />
                      </div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Queue Clear</p>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
