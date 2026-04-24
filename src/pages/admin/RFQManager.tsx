import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  ArrowRight, 
  Trash2, 
  ChevronRight,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Mail,
  Calendar
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RFQ } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function RFQManager() {
  const { rfqs, addRFQ, updateRFQStatus, deleteRFQ } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState<Partial<RFQ>>({
    client: '',
    contact: '',
    products: '',
    qty: 0,
    delivery: '',
    priority: 'Normal',
    status: 'Pending',
    notes: ''
  });

  const filteredRFQs = useMemo(() => {
    return rfqs.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = r.id.toLowerCase().includes(q) || 
                           r.client.toLowerCase().includes(q) ||
                           r.products.toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [rfqs, searchQuery, filterStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRFQ(formData as Omit<RFQ, 'id' | 'date'>);
    setIsModalOpen(false);
    setFormData({
      client: '',
      contact: '',
      products: '',
      qty: 0,
      delivery: '',
      priority: 'Normal',
      status: 'Pending',
      notes: ''
    });
  };

  const getPriorityColor = (priority: RFQ['priority']) => {
    switch (priority) {
      case 'Urgent': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusColor = (status: RFQ['status']) => {
    switch (status) {
      case 'Pending': return 'text-amber-400 bg-amber-400/10';
      case 'Quoted': return 'text-blue-400 bg-blue-400/10';
      case 'Won': return 'text-emerald-400 bg-emerald-400/10';
      case 'Lost': return 'text-red-400 bg-red-400/10';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">RFQ / Quotations</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage requests for quotation from industrial clients.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 group"
        >
          <Plus size={20} /> New RFQ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-4 rounded-[2rem] border-white/5 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search clients, products, or ID..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-primary/50 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary/50 appearance-none cursor-pointer font-bold text-xs uppercase tracking-widest"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Quoted">Quoted</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredRFQs.map((rfq) => (
                <motion.div 
                  key={rfq.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass group rounded-[2.5rem] border-white/5 overflow-hidden hover:border-primary/20 transition-all duration-300"
                >
                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white leading-none uppercase tracking-tight">{rfq.client}</h3>
                          <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", getPriorityColor(rfq.priority))}>
                            {rfq.priority}
                          </span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                          <Mail size={12} /> {rfq.contact} • Created {rfq.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]", getStatusColor(rfq.status))}>
                           {rfq.status}
                         </span>
                         <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                      </div>
                    </div>

                    <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
                       <p className="text-slate-300 text-sm font-medium leading-relaxed">{rfq.products}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                      <div className="flex items-center gap-10">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Quantity</p>
                          <p className="text-white font-bold">{rfq.qty} Units</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Expected Delivery</p>
                          <p className="text-white font-bold flex items-center gap-2">
                            <Calendar size={14} className="text-primary" /> {rfq.delivery}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateRFQStatus(rfq.id, 'Quoted')}
                          className="px-6 py-3 bg-white/5 hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border border-white/5"
                        >
                          Send Quote
                        </button>
                        <button 
                          onClick={() => deleteRFQ(rfq.id)}
                          className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-red-400/10 text-slate-500 hover:text-red-400 rounded-2xl transition-all border border-white/5"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredRFQs.length === 0 && (
              <div className="py-20 text-center glass rounded-[3rem] border-white/5">
                <FileText size={48} className="text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">No Active Requests</h3>
                <p className="text-slate-500 text-sm">All clear! No pending RFQs found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Clock size={20} className="text-primary" /> Response Deadlines
              </h3>
              <div className="space-y-4">
                <div className="p-5 bg-red-400/5 rounded-3xl border border-red-400/10 space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-bold text-red-400 uppercase tracking-widest">
                      <span>Urgent Response</span>
                      <span>2h Left</span>
                   </div>
                   <p className="text-sm font-bold text-white">Bharath Electronics</p>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 animate-pulse w-[85%]" />
                   </div>
                </div>
                <div className="p-5 bg-amber-400/5 rounded-3xl border border-amber-400/10 space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      <span>High Priority</span>
                      <span>18h Left</span>
                   </div>
                   <p className="text-sm font-bold text-white">Sri Venkateswara Ind.</p>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 w-[45%]" />
                   </div>
                </div>
              </div>
           </div>

           <div className="p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 space-y-4 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-primary/10 group-hover:rotate-12 transition-transform duration-700">
                <Zap size={140} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Conversion Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-bold text-white">68.4%</span>
                <span className="text-xs font-bold text-emerald-400 leading-none">↑ 5%</span>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[180px]">
                You have won 14/22 quotations submitted this month. Great progress!
              </p>
           </div>
        </div>
      </div>

      {/* New RFQ Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass rounded-[3rem] border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-display font-bold text-white tracking-tight">Manual RFQ Entry</h2>
                  <p className="text-slate-500 text-sm font-medium">Record a quotation request received via phone or offline channels.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/5 transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                <form id="rfq-form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Client Entity</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Organization Name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary transition-all font-bold placeholder:text-slate-700"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Contact Reference</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Email or Phone Number"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary transition-all font-bold placeholder:text-slate-700"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Technical Requirements</label>
                    <textarea 
                      required
                      placeholder="List products, model numbers, and specific technical requirements..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary transition-all font-medium resize-none placeholder:text-slate-700 leading-relaxed"
                      rows={4}
                      value={formData.products}
                      onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Volume (Qty)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary transition-all font-bold"
                        value={formData.qty}
                        onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Delivery Deadline</label>
                      <input 
                        required
                        type="date" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary transition-all font-bold"
                        value={formData.delivery}
                        onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Priority Tier</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Administrative Notes</label>
                    <input 
                       type="text"
                       placeholder="Internal directives or client requests..."
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary transition-all font-medium placeholder:text-slate-700"
                       value={formData.notes}
                       onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </form>
              </div>

              <div className="p-10 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4 bg-white/[0.01]">
                 <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-5 rounded-2xl text-slate-300 font-black uppercase tracking-[0.2em] text-xs hover:bg-white/5 transition-all border border-white/5"
                >
                  Discard Entry
                </button>
                <button 
                  form="rfq-form"
                  type="submit"
                  className="bg-primary hover:bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs neon-glow-primary transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                   Finalize RFQ Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
