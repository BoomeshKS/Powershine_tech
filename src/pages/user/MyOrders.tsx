import React from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink,
  Zap,
  ShoppingBag,
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
  const { orders } = useStore();
  const { user } = useAuth();

  const userOrders = orders.filter(o => o.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (userOrders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
          <Package className="text-slate-700" size={48} />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">No orders yet</h1>
        <p className="text-slate-500 mb-10 text-lg">You haven't placed any industrial orders yet. Start shopping to see your history.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg neon-glow-primary hover:scale-105 transition-all"
        >
          Browse Products <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Order History</h1>
          <p className="text-slate-400">Track and manage your industrial component orders.</p>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="text-slate-500 uppercase tracking-widest">Total Orders:</span>
            <span className="text-primary bg-primary/10 px-4 py-1 rounded-full border border-primary/20">{userOrders.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {userOrders.map((order, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={order.id}
            className="glass rounded-[2.5rem] border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            {/* Order Header */}
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5">
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Order ID</p>
                  <p className="text-white font-bold">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Date</p>
                  <p className="text-white font-bold">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total</p>
                  <p className="text-primary font-bold">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2",
                  order.status === 'Delivered' ? "bg-green-500/10 text-green-500" : 
                  order.status === 'Cancelled' ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                )}>
                  {order.status === 'Delivered' ? <CheckCircle size={14} /> : 
                   order.status === 'Cancelled' ? <XCircle size={14} /> : <Clock size={14} />}
                  {order.status}
                </span>
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-white font-display font-bold flex items-center gap-2 mb-4">
                    <ShoppingBag size={18} className="text-primary" /> Items
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-1">₹{item.price.toLocaleString()} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-white font-display font-bold flex items-center gap-2 mb-4">
                      <Truck size={18} className="text-accent" /> Shipping Details
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-slate-500 mt-1" size={16} />
                        <p className="text-slate-300 leading-relaxed">{order.shippingAddress}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-slate-500" size={16} />
                        <p className="text-slate-300">Paid via {order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <button className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      Track Shipment <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
