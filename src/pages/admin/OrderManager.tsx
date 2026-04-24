import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Package
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function OrderManager() {
  const { orders, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['Order ID,Customer ID,Total,Status,Date,Address,Payment'];
    const rows = filteredOrders.map(o => 
      `${o.id},${o.userId},${o.total},${o.status},${o.date},"${o.shippingAddress}",${o.paymentMethod}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_report.csv");
    document.body.appendChild(link);
    link.click();
    toast.success('Exporting orders...');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Order Management</h1>
          <p className="text-slate-400">Track and manage customer orders.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all hover:bg-white/10"
        >
          <Download size={20} /> Export CSV
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by Order ID or User ID..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(status => <option key={status} value={status} className="bg-dark-bg">{status}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-white">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                        U{order.userId}
                      </div>
                      <span className="text-sm text-slate-300">User {order.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select 
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer border border-transparent focus:border-primary transition-all",
                          order.status === 'Delivered' ? "bg-green-500/10 text-green-500" : 
                          order.status === 'Cancelled' ? "bg-red-500/10 text-red-500" : 
                          order.status === 'Shipped' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                        )}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      >
                        {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s} className="bg-dark-bg">{s}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-white/5 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Showing <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="text-white font-bold">{filteredOrders.length}</span> orders
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-2 border border-white/10 rounded-xl text-slate-400 hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 border border-white/10 rounded-xl text-slate-400 hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-3xl glass rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">Order Details</h2>
                <p className="text-slate-400 text-sm mt-1">Order ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Customer</p>
                      <p className="text-white font-bold mt-1">User {selectedOrder.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Shipping Address</p>
                      <p className="text-white font-medium mt-1 leading-relaxed">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-neon-purple/10 rounded-2xl text-neon-purple">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Payment Method</p>
                      <p className="text-white font-bold mt-1">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-neon-green/10 rounded-2xl text-neon-green">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Order Date</p>
                      <p className="text-white font-bold mt-1">{new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-display font-bold flex items-center gap-2">
                  <Package size={18} className="text-primary" /> Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
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

              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex justify-between items-center">
                <span className="text-slate-300 font-bold">Total Amount</span>
                <span className="text-2xl font-display font-bold text-primary">₹{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 flex justify-end gap-4">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
              >
                Close
              </button>
              <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold neon-glow-primary hover:scale-105 transition-all">
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
