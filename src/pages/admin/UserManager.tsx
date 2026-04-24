import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Shield, 
  ShieldAlert, 
  Ban, 
  CheckCircle, 
  MoreVertical, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Mail,
  History,
  Lock,
  Unlock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { User as UserType } from '../../types';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function UserManager() {
  const { users, updateUserRole, toggleUserBlock, orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const roles = ['All', 'admin', 'user'];

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getUserOrderStats = (userId: string) => {
    const userOrders = orders.filter(o => o.userId === userId);
    const totalSpent = userOrders.reduce((acc, o) => acc + o.total, 0);
    return { count: userOrders.length, spent: totalSpent };
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">User Management</h1>
          <p className="text-slate-400">Manage user accounts and permissions.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
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
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {roles.map(role => <option key={role} value={role} className="bg-dark-bg capitalize">{role}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedUsers.map((u) => {
                const stats = getUserOrderStats(u.id);
                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-none mb-1">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select 
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer border border-transparent focus:border-primary transition-all",
                            u.role === 'admin' ? "bg-neon-purple/10 text-neon-purple" : "bg-green-500/10 text-green-500"
                          )}
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                        >
                          <option value="admin" className="bg-dark-bg">Admin</option>
                          <option value="user" className="bg-dark-bg">User</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-bold">{stats.count}</td>
                    <td className="px-6 py-4 text-sm text-primary font-bold">₹{stats.spent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        !u.isBlocked ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {!u.isBlocked ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedUser(u)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <History size={18} />
                        </button>
                        <button 
                          onClick={() => toggleUserBlock(u.id)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            u.isBlocked ? "text-green-400 hover:bg-green-400/10" : "text-red-400 hover:bg-red-400/10"
                          )}
                        >
                          {u.isBlocked ? <Unlock size={18} /> : <Ban size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-white/5 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Showing <span className="text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="text-white font-bold">{filteredUsers.length}</span> users
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-2xl glass rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">{selectedUser.name}</h2>
                  <p className="text-slate-400 text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <CheckCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Role</p>
                  <p className="text-white font-bold capitalize">{selectedUser.role}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Joined</p>
                  <p className="text-white font-bold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Orders</p>
                  <p className="text-white font-bold">{getUserOrderStats(selectedUser.id).count}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Spent</p>
                  <p className="text-primary font-bold">₹{getUserOrderStats(selectedUser.id).spent.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-display font-bold flex items-center gap-2">
                  <History size={18} className="text-primary" /> Order History
                </h4>
                <div className="space-y-3">
                  {orders.filter(o => o.userId === selectedUser.id).length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No orders found</p>
                  ) : (
                    orders.filter(o => o.userId === selectedUser.id).map(o => (
                      <div key={o.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div>
                          <p className="text-sm font-bold text-white">{o.id}</p>
                          <p className="text-xs text-slate-500 mt-1">{new Date(o.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">₹{o.total.toLocaleString()}</p>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            o.status === 'Delivered' ? "text-green-500" : "text-yellow-500"
                          )}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 flex justify-end gap-4">
              <button 
                onClick={() => toggleUserBlock(selectedUser.id)}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold transition-all",
                  selectedUser.isBlocked ? "bg-green-500 text-white" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}
              >
                {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
              </button>
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
