import React, { useState, useMemo, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  Settings, 
  LogOut, 
  Package, 
  Phone, 
  MessageSquare, 
  Clock, 
  Smartphone, 
  FileText, 
  Users as UsersIcon,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Award,
  CircleDot,
  Tag,
  PhoneOff,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  History,
  Download,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { User, Role } from '../../types';

type InteractionType = 'All' | 'Call' | 'Chat' | 'Email' | 'Meeting' | 'SMS' | 'Note';
type ProfileTab = 'CRM' | 'AdminSettings';

interface LogEntry {
  id: string;
  type: InteractionType;
  direction: 'inbound' | 'outbound';
  summary: string;
  duration?: string;
  date: string;
  time: string;
  status: 'Completed' | 'Resolved' | 'Missed' | 'Archived' | 'Ongoing';
  note?: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  type: 'Login' | 'Role Change' | 'Status Update' | 'Export' | 'Security';
  details: string;
  timestamp: string;
}

const LOG_ENTRIES: LogEntry[] = [
  { id: 'm1', type: 'Call', direction: 'inbound', summary: 'Missed call from factory manager (Unit 7)', date: 'Apr 18, 2026', time: '09:45 AM', status: 'Missed', note: 'voicemail left' },
  { id: 'm2', type: 'Call', direction: 'inbound', summary: 'Urgent: System failure report from textile plant', date: 'Apr 18, 2026', time: '08:30 AM', status: 'Missed', note: 'no voicemail' },
  { id: 'm3', type: 'Call', direction: 'inbound', summary: 'Inquiry regarding spare parts availability', date: 'Apr 17, 2026', time: '05:15 PM', status: 'Missed', note: 'email sent instead' },
  { id: '1', type: 'Call', direction: 'inbound', summary: 'Technical discussion regarding PLC module fault in Unit 4', duration: '12m 45s', date: 'Apr 17, 2026', time: '10:30 AM', status: 'Completed' },
  { id: '2', type: 'Chat', direction: 'inbound', summary: 'Customer requested pricing for bulk LCD display order', duration: '5m', date: 'Apr 17, 2026', time: '02:15 PM', status: 'Resolved' },
  { id: '3', type: 'Email', direction: 'outbound', summary: 'Sent annual maintenance contract proposal for textile plant', date: 'Apr 16, 2026', time: '11:20 AM', status: 'Completed' },
  { id: '4', type: 'Meeting', direction: 'outbound', summary: 'Site visit for Schneider PLC system integration', duration: '2h 15m', date: 'Apr 15, 2026', time: '09:00 AM', status: 'Completed' },
  { id: '5', type: 'SMS', direction: 'outbound', summary: 'Order delivery confirmation sent for Servo Drives', date: 'Apr 14, 2026', time: '04:45 PM', status: 'Completed' },
  { id: '6', type: 'Note', direction: 'outbound', summary: 'Updated technical specifications for the upcoming VFD range', date: 'Apr 13, 2026', time: '01:30 PM', status: 'Archived' },
  { id: '7', type: 'Call', direction: 'outbound', summary: 'Follow-up on pending invoice for the AC Drive kit', duration: '3m 20s', date: 'Apr 12, 2026', time: '11:00 AM', status: 'Completed' },
  { id: '8', type: 'Chat', direction: 'inbound', summary: 'Inquiry about compatibility of HMI with existing system', duration: '15m', date: 'Apr 11, 2026', time: '03:40 PM', status: 'Resolved' },
  { id: '9', type: 'Email', direction: 'inbound', summary: 'Received feedback on the newly installed sensor network', date: 'Apr 10, 2026', time: '10:15 AM', status: 'Completed' },
  { id: '10', type: 'Meeting', direction: 'inbound', summary: 'Initial discovery call for smart factory automation project', duration: '45m', date: 'Apr 09, 2026', time: '02:00 PM', status: 'Completed' },
  { id: '11', type: 'SMS', direction: 'inbound', summary: 'Confirmation of technical visit receipt', date: 'Apr 08, 2026', time: '09:30 AM', status: 'Completed' },
  { id: '12', type: 'Call', direction: 'inbound', summary: 'Emergency support: Machine down due to VFD error', duration: '28m 10s', date: 'Apr 07, 2026', time: '08:15 PM', status: 'Completed' },
  { id: '13', type: 'Note', direction: 'outbound', summary: 'Customer requested express shipping for next 3 orders', date: 'Apr 06, 2026', time: '12:00 PM', status: 'Archived' },
  { id: '14', type: 'Chat', direction: 'outbound', summary: 'Shared manual for the new logic controller', duration: '2m', date: 'Apr 05, 2026', time: '11:45 AM', status: 'Resolved' },
];

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'l1', userId: '1', userName: 'Admin', type: 'Login', details: 'Successful administrative login from IP 192.168.1.45', timestamp: '2026-04-18T08:30:00Z' },
  { id: 'l2', userId: '1', userName: 'Admin', type: 'Security', details: 'Firewall rules audited and updated for Q2', timestamp: '2026-04-18T07:15:00Z' },
  { id: 'l3', userId: '1', userName: 'Admin', type: 'Role Change', details: 'Promoted user "Dev_Support" to Moderator rank', timestamp: '2026-04-17T15:20:00Z' },
  { id: 'l4', userId: '1', userName: 'Admin', type: 'Status Update', details: 'Blocked suspicious account ID #4492', timestamp: '2026-04-17T11:45:00Z' },
  { id: 'l5', userId: '1', userName: 'Admin', type: 'Export', details: 'CSV export of monthly revenue data completed', timestamp: '2026-04-16T14:10:00Z' },
];

const TYPE_CONFIG: Record<InteractionType, { icon: any; color: string; bg: string }> = {
  All: { icon: Clock, color: 'text-white', bg: 'bg-white/10' },
  Call: { icon: Phone, color: 'text-primary', bg: 'bg-primary/10' },
  Chat: { icon: MessageSquare, color: 'text-accent', bg: 'bg-accent/10' },
  Email: { icon: Mail, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  Meeting: { icon: UsersIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  SMS: { icon: Smartphone, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  Note: { icon: FileText, color: 'text-slate-400', bg: 'bg-slate-400/10' },
};

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const { orders, users, updateUserRole, toggleUserBlock } = useStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('CRM');
  const [activeFilter, setActiveFilter] = useState<InteractionType>('All');
  const [showMissedOnly, setShowMissedOnly] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Admin Settings Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role | 'blocked'>('all');
  const [logFilter, setLogFilter] = useState<'all' | ActivityLog['type']>('all');
  const [confirmAction, setConfirmAction] = useState<{ id: string, type: 'block' | 'unblock' } | null>(null);

  const missedCount = LOG_ENTRIES.filter(l => l.status === 'Missed').length;

  const filteredLogs = useMemo(() => {
    if (showMissedOnly) return LOG_ENTRIES.filter(log => log.status === 'Missed');
    if (activeFilter === 'All') return LOG_ENTRIES.filter(log => log.status !== 'Missed');
    return LOG_ENTRIES.filter(log => log.type === activeFilter && log.status !== 'Missed');
  }, [activeFilter, showMissedOnly]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                           u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = roleFilter === 'all' || 
                         (roleFilter === 'blocked' ? u.isBlocked : u.role === roleFilter);
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, roleFilter]);

  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter(log => logFilter === 'all' || log.type === logFilter);
  }, [activityLogs, logFilter]);

  const addLog = (type: ActivityLog['type'], details: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || '0',
      userName: user?.name || 'System',
      type,
      details,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleRoleChange = (userId: string, targetUser: User, newRole: Role) => {
    updateUserRole(userId, newRole);
    addLog('Role Change', `Changed role of user "${targetUser.name}" to ${newRole}`);
  };

  const handleBlockAction = (u: User) => {
    toggleUserBlock(u.id);
    const action = u.isBlocked ? 'unblocked' : 'blocked';
    addLog('Status Update', `${action.charAt(0).toUpperCase() + action.slice(1)} user account "${u.name}"`);
    setConfirmAction(null);
  };

  const handleExport = () => {
    addLog('Export', 'Successfully triggered system activity log export (CSV)');
  };

  const handleTypeClick = (type: InteractionType) => {
    setActiveFilter(type);
    setShowMissedOnly(false);
  };

  const handleMissedToggle = () => {
    setShowMissedOnly(!showMissedOnly);
    if (!showMissedOnly) {
      setActiveFilter('All');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 transition-all duration-500">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-96 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-primary/20" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 border-4 border-dark-bg neon-glow-primary">
                {user.name[0]}
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">{user.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-bold text-primary flex items-center justify-center gap-1.5">
                    <CircleDot size={10} className="animate-pulse" /> Active
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Account</p>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Enterprise</p>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Deal Value</span>
                  <span className="text-white font-bold">₹12.5L</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(5,150,105,0.4)]" />
                </div>
                
                <div className="pt-4 flex flex-wrap gap-2">
                  <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">High Priority</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded">Tech-Focused</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded">Long Term</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-2">
            <button 
              onClick={() => setActiveTab('CRM')}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold",
                activeTab === 'CRM' ? "bg-primary text-white neon-glow-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <MessageSquare size={20} /> CRM History
            </button>
            <button 
              onClick={() => setActiveTab('AdminSettings')}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold",
                activeTab === 'AdminSettings' ? "bg-primary text-white neon-glow-primary" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Shield size={20} /> Admin Settings
            </button>
            <Link to="/orders" className="flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold">
              <Package size={20} /> My Orders
            </Link>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-400/10 transition-all font-bold"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'CRM' ? (
              <motion.div
                key="crm-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid sm:grid-cols-4 gap-6">
                  <div className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Orders</p>
                      <p className="text-3xl font-display font-bold text-white">{orders.filter(o => o.userId === user.id).length}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-3xl text-primary">
                      <TrendingUp size={32} />
                    </div>
                  </div>
                  <div className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Interactions</p>
                      <p className="text-3xl font-display font-bold text-white">{LOG_ENTRIES.length}</p>
                    </div>
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent">
                      <MessageSquare size={32} />
                    </div>
                  </div>
                  <div className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between border-red-500/20">
                    <div>
                      <p className="text-xs text-red-500 uppercase tracking-widest font-bold mb-1">Missed Calls</p>
                      <p className="text-3xl font-display font-bold text-red-400">{missedCount}</p>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-3xl text-red-500">
                      <PhoneOff size={32} />
                    </div>
                  </div>
                  <div className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Account Level</p>
                      <p className="text-3xl font-display font-bold text-white">Tier 1</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-3xl text-blue-400">
                      <Award size={32} />
                    </div>
                  </div>
                </div>

                <div className="glass p-10 rounded-[3rem] border-white/5 min-h-[600px]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                      <h3 className="text-3xl font-display font-bold text-white mb-1">CRM Contact History</h3>
                      <p className="text-slate-500 text-sm">Professional interaction history and technical notes.</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                      <Tag size={16} className="text-primary" />
                      <span className="text-xs font-bold text-white">Visible: {filteredLogs.length}</span>
                    </div>
                  </div>

                  {/* Filter Group */}
                  <div className="space-y-4 mb-10">
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(TYPE_CONFIG) as InteractionType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleTypeClick(type)}
                          className={cn(
                            "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border",
                            activeFilter === type && !showMissedOnly
                              ? "bg-primary text-white border-primary neon-glow-primary" 
                              : "bg-white/5 text-slate-500 border-white/5 hover:border-white/20 hover:text-slate-300"
                          )}
                        >
                          {type === 'All' ? <Clock size={14} /> : React.createElement(TYPE_CONFIG[type].icon, { size: 14 })}
                          {type}
                          <span className={cn(
                            "ml-1 px-1.5 py-0.5 rounded text-[10px]",
                            activeFilter === type && !showMissedOnly ? "bg-white/20" : "bg-white/10"
                          )}>
                            {type === 'All' ? LOG_ENTRIES.filter(l => l.status !== 'Missed').length : LOG_ENTRIES.filter(l => l.type === type && l.status !== 'Missed').length}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <button
                        onClick={handleMissedToggle}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border",
                          showMissedOnly 
                            ? "bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                            : "bg-red-500/5 text-red-500/50 border-red-500/10 hover:border-red-500/20 hover:text-red-500/70"
                        )}
                      >
                        <PhoneOff size={14} />
                        Missed Calls
                        <span className={cn(
                          "ml-1 px-1.5 py-0.5 rounded text-[10px]",
                          showMissedOnly ? "bg-white/20" : "bg-red-500/10"
                        )}>
                          {missedCount}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Log List */}
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => {
                          const isMissed = log.status === 'Missed';
                          const config = isMissed ? { icon: PhoneOff, color: 'text-red-500', bg: 'bg-red-500/10' } : TYPE_CONFIG[log.type];
                          
                          return (
                            <motion.div
                              key={log.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={cn(
                                "group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/[0.02] rounded-[2rem] border transition-all",
                                isMissed 
                                  ? "border-red-500/10 bg-red-500/[0.02] hover:border-red-500/20" 
                                  : "border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                              )}
                            >
                              <div className="flex items-start md:items-center gap-5 flex-1 text-left">
                                <div className={cn("p-4 rounded-2xl bg-white/5 transition-colors group-hover:bg-white/10 relative", config.color)}>
                                  <config.icon size={22} />
                                  <div className="absolute -bottom-1 -right-1 p-1 bg-dark-bg rounded-lg border border-white/10">
                                    {log.direction === 'inbound' ? <ArrowDownLeft size={10} className="text-current" /> : <ArrowUpRight size={10} className="text-current" />}
                                  </div>
                                </div>
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-current", config.color, config.bg)}>
                                      {isMissed ? 'Missed' : log.type}
                                    </span>
                                    {log.duration && (
                                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white/5 px-2.5 py-0.5 rounded-full">
                                        <Clock size={10} /> {log.duration}
                                      </span>
                                    )}
                                    {log.note && (
                                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500/70 italic px-2.5 py-0.5 rounded-full bg-red-500/5">
                                        <AlertCircle size={10} /> {log.note}
                                      </span>
                                    )}
                                  </div>
                                  <p className={cn(
                                    "font-medium text-sm leading-relaxed transition-colors",
                                    isMissed ? "text-red-200" : "text-white group-hover:text-primary"
                                  )}>
                                    {log.summary}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0 md:pl-8 md:text-right flex md:flex-col justify-between items-center md:items-end gap-2">
                                <p className="text-white font-bold text-xs">{log.date}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                  <Calendar size={12} />
                                  {log.time}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10"
                        >
                          <Clock size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
                          <p className="text-slate-500 italic">No {showMissedOnly ? 'missed' : activeFilter.toLowerCase()} entries found matching your filter.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Bar */}
                <div className="grid sm:grid-cols-4 gap-6">
                  <div className="glass p-6 rounded-[2.5rem] border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Users</p>
                    <div className="flex items-end gap-2">
                      <h4 className="text-2xl font-display font-bold text-white">{users.length}</h4>
                      <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded mb-1">+12%</span>
                    </div>
                  </div>
                  <div className="glass p-6 rounded-[2.5rem] border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admins</p>
                    <h4 className="text-2xl font-display font-bold text-white">{users.filter(u => u.role === 'admin').length}</h4>
                  </div>
                  <div className="glass p-6 rounded-[2.5rem] border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Blocked Accounts</p>
                    <h4 className="text-2xl font-display font-bold text-red-500">{users.filter(u => u.isBlocked).length}</h4>
                  </div>
                  <div className="glass p-6 rounded-[2.5rem] border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Today</p>
                    <div className="flex items-center gap-2">
                      <h4 className="text-2xl font-display font-bold text-green-500">14</h4>
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-dark-bg bg-primary/20 flex items-center justify-center text-[8px] text-primary font-bold">U{i}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* User Management */}
                  <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white">Role Management</h3>
                        <p className="text-slate-500 text-xs">Authorize or restrict system access level.</p>
                      </div>
                      <ShieldAlert className="text-primary opacity-30" size={32} />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="text"
                          placeholder="Search users..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none"
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="moderator">Moderators</option>
                        <option value="user">Users</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredUsers.map(u => (
                        <div key={u.id} className="p-5 bg-white/[0.02] rounded-[2rem] border border-white/5 group hover:border-white/10 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                {u.name[0]}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                  {u.name}
                                  {u.isBlocked && <span className="bg-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded">Blocked</span>}
                                </h5>
                                <p className="text-[10px] text-slate-500 font-medium">{u.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select 
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, u, e.target.value as Role)}
                                className="bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-300 focus:outline-none"
                              >
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                                <option value="user">User</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-600">ID: {u.id}</span>
                            {confirmAction?.id === u.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-white px-2 py-1">Sure?</span>
                                <button 
                                  onClick={() => handleBlockAction(u)}
                                  className="text-[10px] font-black uppercase tracking-widest bg-red-500 text-white px-3 py-1.5 rounded-lg"
                                >
                                  Yes, {u.isBlocked ? 'Unblock' : 'Block'}
                                </button>
                                <button 
                                  onClick={() => setConfirmAction(null)}
                                  className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-slate-400 px-3 py-1.5 rounded-lg"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setConfirmAction({ id: u.id, type: u.isBlocked ? 'unblock' : 'block' })}
                                className={cn(
                                  "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                                  u.isBlocked ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                )}
                              >
                                {u.isBlocked ? 'Unblock User' : 'Block User'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Logs */}
                  <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white">System Logs</h3>
                        <p className="text-slate-500 text-xs">Audit feed of administrative actions.</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleExport}
                          className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all"
                        >
                          <Download size={18} />
                        </button>
                        <button className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(['all', 'Login', 'Role Change', 'Status Update', 'Export', 'Security'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setLogFilter(f as any)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                            logFilter === f ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredActivityLogs.map(log => (
                        <div key={log.id} className="relative pl-6 pb-6 border-l border-white/10 last:pb-0">
                          <div className={cn(
                            "absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-dark-bg",
                            log.type === 'Security' ? "bg-primary" : 
                            log.type === 'Status Update' ? "bg-red-500" :
                            log.type === 'Role Change' ? "bg-accent" : "bg-blue-400"
                          )} />
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.type}</span>
                            <span className="text-[10px] text-slate-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-white font-medium mb-1">{log.details}</p>
                          <p className="text-[10px] text-slate-500 italic">Performed by {log.userName}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl text-primary">
                            <Shield size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Security Audit Tips</p>
                            <p className="text-[10px] text-primary font-medium">Review Q2 protocols with AI support.</p>
                          </div>
                        </div>
                        <button className="bg-primary text-white p-2 rounded-lg hover:scale-110 transition-transform">
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
