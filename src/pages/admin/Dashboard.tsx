import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  Clock,
  LayoutDashboard,
  Settings,
  PlusCircle,
  Eye,
  UserPlus,
  ArrowRight,
  Download
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { cn } from '../../lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Custom plugin for Doughnut center text
const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart: any) => {
    // Robust guard to prevent "Cannot read properties of undefined (reading 'text')"
    const pluginOptions = chart.config.options?.plugins?.centerText;
    if (!pluginOptions) return;

    const { ctx, chartArea: { top, left, width, height } } = chart;
    const text = pluginOptions.text || '';
    const subtext = pluginOptions.subtext || '';

    ctx.save();
    
    // Main text
    ctx.font = 'bold 2rem Inter';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2 + left, height / 2 + top - 10);

    // Subtext
    ctx.font = '500 0.75rem Inter';
    ctx.fillStyle = '#64748b';
    ctx.fillText(subtext, width / 2 + left, height / 2 + top + 20);
    
    ctx.restore();
  }
};

export default function AdminDashboard() {
  const { products, orders, users } = useStore();
  const { user: admin } = useAuth();
  const [revenueRange, setRevenueRange] = useState<'6m' | '12m'>('6m');

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const lowStockProducts = products.filter(p => p.stock < 5);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { name: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', trend: '+12.5%', isUp: true },
    { name: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-accent', bg: 'bg-accent/10', trend: '+8.2%', isUp: true },
    { name: 'Total Products', value: products.length, icon: Package, color: 'text-green-400', bg: 'bg-green-400/10', trend: '-2.4%', isUp: false },
    { name: 'Total Users', value: users.length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: '+15.1%', isUp: true },
  ];

  // 1. Line Chart Data - Monthly Revenue
  const lineData = useMemo(() => {
    const labels = revenueRange === '6m' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      : ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return {
      labels,
      datasets: [
        {
          label: 'Actual Revenue',
          data: revenueRange === '6m' ? [45000, 52000, 48000, 61000, 55000, 72000] : [32000, 38000, 41000, 45000, 42000, 49000, 45000, 52000, 48000, 61000, 55000, 72000],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10b981',
          borderWidth: 3,
        },
        {
          label: 'Target Revenue',
          data: revenueRange === '6m' ? [40000, 45000, 50000, 55000, 60000, 65000] : [25000, 30000, 35000, 40000, 45000, 50000, 40000, 45000, 50000, 55000, 60000, 65000],
          borderColor: 'rgba(56, 189, 248, 0.5)',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          fill: false,
          borderWidth: 2,
        }
      ],
    };
  }, [revenueRange]);

  // 2. Doughnut Chart Data - Order Status
  const statusCounts = {
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  const deliveryRate = ((statusCounts.Delivered / orders.length) * 100).toFixed(0);

  const doughnutData = {
    labels: ['Delivered', 'Processing', 'Shipped', 'Cancelled'],
    datasets: [{
      data: [statusCounts.Delivered, statusCounts.Processing, statusCounts.Shipped, statusCounts.Cancelled],
      backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
      borderColor: 'transparent',
      hoverOffset: 10,
      cutout: '75%',
    }]
  };

  // 3. Horizontal Bar Chart Data - Category Revenue
  const categoryData = useMemo(() => {
    const categories = ['PLC', 'Drives', 'HMI', 'Sensors', 'Brakes'];
    const values = [125000, 98000, 76000, 45000, 32000];
    
    return {
      labels: categories,
      datasets: [{
        label: 'Revenue by Category',
        data: values,
        backgroundColor: [
          '#10b981',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(16, 185, 129, 0.4)',
          'rgba(16, 185, 129, 0.2)',
        ],
        borderRadius: 8,
        barThickness: 24,
      }]
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter">
            Dashboard <span className="text-primary">Overview</span>
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Analytics • {admin?.name || 'Admin'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/admin/settings" 
            className="bg-white/5 border border-white/10 text-white p-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <Settings size={20} />
          </Link>
          <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold neon-glow-primary hover:scale-105 transition-all flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Quick Actions removed for more space as per design request implied by "integrated three charts" and "purposed-built" focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-3xl border-white/5 group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                stat.isUp ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
              )}>
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Line Chart - Monthly Revenue */}
        <div className="lg:col-span-2 glass p-8 rounded-[3rem] border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-display font-bold text-white">Monthly Revenue</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Growth Index</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              {(['6m', '12m'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setRevenueRange(range)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    revenueRange === range ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                  )}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <Line 
              {...{ id: "revenue-chart" } as any}
              data={lineData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    display: true, 
                    position: 'top',
                    align: 'end',
                    labels: { color: '#64748b', font: { weight: 'bold', size: 10 }, usePointStyle: true }
                  },
                  tooltip: {
                    backgroundColor: '#151619',
                    titleColor: '#fff',
                    bodyColor: '#10b981',
                    bodyFont: { weight: 'bold' },
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                      label: (context) => `₹${context.parsed.y.toLocaleString()}`
                    }
                  }
                },
                scales: { 
                  y: { 
                    grid: { color: 'rgba(255,255,255,0.03)' }, 
                    ticks: { color: '#64748b', font: { size: 10 }, callback: (v) => `₹${Number(v)/1000}k` } 
                  },
                  x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
                }
              }} 
            />
          </div>
        </div>

        {/* Doughnut Chart - Order Status */}
        <div className="glass p-8 rounded-[3rem] border-white/5 flex flex-col">
          <h4 className="text-xl font-display font-bold text-white mb-2 text-center">Order Status</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mb-8">Fulfillment Analytics</p>
          
          <div className="h-48 relative mb-10">
            <Doughnut 
              {...{ id: "order-status-chart" } as any}
              data={doughnutData}
              plugins={[centerTextPlugin]}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  centerText: {
                    text: `${deliveryRate}%`,
                    subtext: 'Delivered'
                  }
                }
              } as any}
            />
          </div>

          <div className="space-y-4 mt-auto">
            {doughnutData.labels.map((label, i) => (
              <div key={label} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)]" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }} />
                  <span className="text-xs font-bold text-slate-300">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">{doughnutData.datasets[0].data[i]}</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                    {((doughnutData.datasets[0].data[i] / orders.length) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Bar Chart - Category Revenue */}
        <div className="lg:col-span-3 glass p-10 rounded-[3rem] border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-2xl font-display font-bold text-white">Top Performing Categories</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Revenue Performance Ranking</p>
            </div>
            <button className="flex items-center gap-2 text-primary text-xs font-bold hover:underline transition-all group">
              View Detailed Metrics <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <Bar 
              {...{ id: "category-revenue-chart" } as any}
              data={categoryData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#151619',
                    padding: 12,
                    callbacks: {
                      label: (context) => `₹${context.parsed.x.toLocaleString()}`
                    }
                  }
                },
                scales: {
                  x: { 
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#64748b', font: { size: 10 }, callback: (v) => `₹${Number(v)/1000}k` }
                  },
                  y: { 
                    grid: { display: false },
                    ticks: { color: '#fff', font: { weight: 'bold', size: 12 } }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity remains as it provides vital data context */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2.5rem] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h4 className="text-xl font-display font-bold text-white">Recent Transactions</h4>
            <Link to="/admin/orders" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Full Ledger</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                <tr>
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Partner</th>
                  <th className="px-8 py-5">Revenue</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-white group-hover:text-primary transition-colors">{order.id}</td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">User #{order.userId}</td>
                    <td className="px-8 py-5 text-sm text-white font-bold">₹{order.total.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest",
                        order.status === 'Delivered' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="text-yellow-500" size={24} />
            <h4 className="text-xl font-display font-bold text-white">Critical Inventory</h4>
          </div>
          <div className="space-y-4 flex-1">
            {lowStockProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <Package className="text-slate-800 mb-4" size={48} />
                <p className="text-slate-500 font-bold italic tracking-wide">Infrastructure health optimal</p>
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-red-500/30 transition-all">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-red-500 font-black mt-1 uppercase tracking-widest">{p.stock} units remaining</p>
                  </div>
                  <button className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-transform hover:scale-110">
                    <PlusCircle size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/10 hover:text-white transition-all">
            Full Inventory Audit
          </button>
        </div>
      </div>
    </div>
  );
}
