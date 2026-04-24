import React from 'react';
import { User, Mail, Shield, Calendar, Settings, LogOut, Package, Phone, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { orders } = useStore();

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="md:w-80 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-primary/20" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 border-4 border-dark-bg neon-glow-primary">
                {user.name[0]}
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">{user.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                <Shield size={14} /> {user.role === 'admin' ? 'Administrator' : 'Verified Partner'}
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-2">
            <Link to="/orders" className="flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">
              <Package size={20} /> My Orders
            </Link>
            <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">
              <Settings size={20} /> Settings
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5">
            <h3 className="text-2xl font-display font-bold text-white mb-8">Account Details</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white font-bold">{user.name}</div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white font-bold">{user.email}</div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white font-bold">+91 98765 43210</div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Partner Since</label>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white font-bold">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Lifetime Orders</p>
              <p className="text-3xl font-display font-bold text-white">{orders.filter(o => o.userId === user.id).length}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-3xl text-primary">
              <Package size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
