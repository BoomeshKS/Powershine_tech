import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  Mail, 
  Database, 
  Save, 
  RefreshCw, 
  Zap, 
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function SiteSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { name: 'General', icon: Globe },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
    { name: 'Email', icon: Mail },
    { name: 'System', icon: Database },
  ];

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Settings saved successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Site Settings</h1>
          <p className="text-slate-400">Configure your industrial e-commerce platform.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 neon-glow-primary disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
                activeTab === tab.name 
                  ? "bg-primary text-white neon-glow-primary" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={20} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 glass p-8 rounded-[2.5rem] border-white/5 space-y-10">
          {activeTab === 'General' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300">Site Name</label>
                  <input 
                    type="text" 
                    defaultValue="Powershine Tech" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@powershine.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Site Description</label>
                <textarea 
                  rows={3}
                  defaultValue="Leading industrial electronics service and manufacturing company."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="p-6 bg-yellow-500/10 rounded-3xl border border-yellow-500/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-2xl text-yellow-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Maintenance Mode</h4>
                    <p className="text-slate-400 text-sm">Temporarily disable public access to the site.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <h4 className="text-lg font-display font-bold text-white mb-6">Notification Preferences</h4>
              {[
                { name: 'Order Confirmation', desc: 'Send email when an order is placed', enabled: true },
                { name: 'Stock Alerts', desc: 'Notify admin when stock is low', enabled: true },
                { name: 'New User Registration', desc: 'Notify admin when a new user joins', enabled: false },
                { name: 'System Updates', desc: 'Notify about system maintenance and updates', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div>
                    <h5 className="text-white font-bold">{item.name}</h5>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.enabled} />
                    <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h4 className="text-lg font-display font-bold text-white">Password Policy</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-white font-bold mb-2">Minimum Length</p>
                    <select className="w-full bg-white/10 border border-white/10 rounded-xl py-2 px-4 text-white outline-none">
                      <option className="bg-dark-bg">8 Characters</option>
                      <option className="bg-dark-bg">10 Characters</option>
                      <option className="bg-dark-bg">12 Characters</option>
                    </select>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-white font-bold mb-2">Require Special Characters</p>
                    <div className="flex gap-4">
                      <button className="flex-1 py-2 bg-primary text-white rounded-xl font-bold">Yes</button>
                      <button className="flex-1 py-2 bg-white/10 text-slate-400 rounded-xl font-bold">No</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Two-Factor Authentication</h4>
                    <p className="text-slate-400 text-sm">Add an extra layer of security to admin accounts.</p>
                  </div>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold neon-glow-primary">Enable 2FA</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
