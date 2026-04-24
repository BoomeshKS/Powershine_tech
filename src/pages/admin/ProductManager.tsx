import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Package, 
  ArrowUpDown, 
  CheckCircle, 
  AlertCircle,
  X,
  Upload,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Trash
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

// Category emoji mapping for placeholders
const CATEGORY_ICONS: Record<string, string> = {
  'PLC': '⚙️',
  'Sensors': '📡',
  'Drives': '⚡',
  'HMI': '📟',
  'Motors': '🔌',
  'Robotics': '🤖',
  'Default': '📦'
};

export default function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || 
                           p.sku.toLowerCase().includes(q) ||
                           p.brand.toLowerCase().includes(q);
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, filterCategory, filterStatus]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: '',
    brand: '',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    status: 'Active',
    specifications: {},
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        brand: '',
        price: 0,
        stock: 0,
        description: '',
        image: '',
        status: 'Active',
        specifications: {},
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData as Omit<Product, 'id'>);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || CATEGORY_ICONS['Default'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Inventory Control</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage and monitor your industrial hardware catalog.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 group hover:-translate-y-1"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={18} />
          </div>
          Add New Product
        </button>
      </div>

      {/* Filters & Search - Modern Layout */}
      <div className="glass p-4 sm:p-6 rounded-[2.5rem] border-white/5 flex flex-col xl:flex-row gap-6 items-stretch">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by Name, SKU, or Brand..." 
            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:w-auto">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] py-4 pl-11 pr-8 text-white outline-none focus:border-primary/50 appearance-none cursor-pointer font-bold text-xs uppercase tracking-widest"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat} className="bg-dark-bg">{cat} {cat === 'All' ? '' : 'Products'}</option>)}
            </select>
          </div>
          <div className="relative">
            <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-[1.25rem] py-4 pl-11 pr-8 text-white outline-none focus:border-primary/50 appearance-none cursor-pointer font-bold text-xs uppercase tracking-widest"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All" className="bg-dark-bg">All Status</option>
              <option value="Active" className="bg-dark-bg">Active Only</option>
              <option value="Draft" className="bg-dark-bg">Drafts</option>
              <option value="Out of Stock" className="bg-dark-bg">Sold Out</option>
            </select>
          </div>
          <button className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-[1.25rem] font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 group whitespace-nowrap">
            <ArrowUpDown size={16} className="group-hover:text-primary" /> 
            <span className="text-xs uppercase tracking-widest">Sort Inventory</span>
          </button>
        </div>
      </div>

      {/* Product Table - High Fidelity */}
      <div className="glass rounded-[3rem] border-white/5 overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-8 py-5">Product Metadata</th>
                <th className="px-6 py-5">Category Classification</th>
                <th className="px-6 py-5">Financial Point</th>
                <th className="px-6 py-5">Inventory Depth</th>
                <th className="px-6 py-5">System Status</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
                  <motion.tr 
                    key={product.id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.03] transition-colors group relative"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:scale-110 transition-transform duration-500" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-3xl select-none group-hover:scale-110 transition-transform">
                              {getCategoryIcon(product.category)}
                            </div>
                          )}
                          <div className={cn(
                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-bg",
                            product.status === 'Active' ? "bg-green-500" : "bg-slate-500"
                          )} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate mb-1 group-hover:text-primary transition-colors">{product.name}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">SKU: {product.sku}</span>
                             <span className="text-[10px] text-slate-600 font-medium">| {product.brand}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 w-fit">
                        <span className="text-sm">{getCategoryIcon(product.category)}</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          {product.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-0.5">
                        <p className="text-base font-display font-bold text-white">₹{product.price.toLocaleString()}</p>
                        {product.discountPrice && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 line-through font-bold">₹{product.discountPrice.toLocaleString()}</span>
                            <span className="text-[10px] text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded">-{Math.round((1 - product.discountPrice/product.price)*100)}%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                        )} />
                        <div className="space-y-0.5">
                          <p className={cn(
                            "text-sm font-bold",
                            product.stock === 0 ? "text-red-400" : "text-white"
                          )}>
                            {product.stock} Units
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">In Warehouse</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                        product.status === 'Active' ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]" : 
                        product.status === 'Draft' ? "bg-slate-500/10 text-slate-500 border-slate-500/20" : 
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-white/5"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(product.id)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-white/5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Inventory Discrepancy</h3>
              <p className="text-slate-500 max-w-sm mx-auto">No products were found matching your current search parameters. Clear filters to see full stock.</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterCategory('All'); setFilterStatus('All'); }}
                className="mt-6 text-primary text-sm font-bold uppercase tracking-widest hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination - Professional Style */}
        <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
               <p className="text-xs text-slate-500 font-bold">
                Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-white">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="text-white">{filteredProducts.length}</span>
              </p>
            </div>
            <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
               <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${(filteredProducts.length > 0 ? (Math.min(currentPage * itemsPerPage, filteredProducts.length) / filteredProducts.length) * 100 : 0)}%` }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-6 py-3 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-xs font-bold transition-all border",
                    currentPage === i + 1 ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-6 py-3 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
              className="relative w-full max-w-5xl glass rounded-[3rem] border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-primary/10 rounded-3xl text-primary">
                    <Package size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                      {editingProduct ? 'Update Inventory' : 'Expand Catalog'}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Drafting the technical specifications for high-load systems.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-2xl border border-white/5">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <form id="product-form" onSubmit={handleSubmit} className="p-10 space-y-12">
                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* Visual Interface Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                           <ImageIcon size={14} className="text-primary" /> Product Identity Visual
                         </label>
                         {formData.image && (
                           <button 
                            type="button" 
                            onClick={removeImage}
                            className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1.5 uppercase tracking-widest"
                           >
                             <Trash size={12} /> Clear Visual
                           </button>
                         )}
                      </div>
                      
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "aspect-[16/10] rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer",
                          formData.image ? "border-primary/30" : "border-white/10 hover:border-primary/50 hover:bg-primary/5 bg-white/[0.02]"
                        )}
                      >
                        {formData.image ? (
                          <>
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                              <div className="flex flex-col items-center gap-3 scale-90 group-hover:scale-100 transition-transform">
                                <div className="p-4 bg-white/10 rounded-full border border-white/20">
                                  <Upload size={24} className="text-white" />
                                </div>
                                <p className="text-xs font-bold text-white uppercase tracking-widest">Replace Visual Data</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-8 space-y-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                              <Upload className="text-primary" size={32} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-white">Upload Asset</p>
                              <p className="text-xs text-slate-500">PNG, WEBP, or JPG up to 5MB</p>
                            </div>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Unique Identifier (SKU)</label>
                          <input 
                            required
                            type="text" 
                            placeholder="PLC-X100-24"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all font-bold placeholder:text-slate-700 uppercase"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Availability Index</label>
                          <select 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all font-bold appearance-none cursor-pointer"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          >
                            <option value="Active" className="bg-dark-bg">Market Active</option>
                            <option value="Draft" className="bg-dark-bg">System Draft</option>
                            <option value="Out of Stock" className="bg-dark-bg">Zero Inventory</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Product Nomenclature</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Industrial Logic Controller"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all text-lg font-bold placeholder:text-slate-700"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Operational Category</label>
                          <select 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all font-bold appearance-none cursor-pointer"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          >
                            <option value="" disabled className="bg-dark-bg">Select Category...</option>
                            <option value="PLC" className="bg-dark-bg">⚙️ PLC Controllers</option>
                            <option value="Sensors" className="bg-dark-bg">📡 Industrial Sensors</option>
                            <option value="Drives" className="bg-dark-bg">⚡ VFD / Servo Drives</option>
                            <option value="HMI" className="bg-dark-bg">📟 HMI Panels</option>
                            <option value="Motors" className="bg-dark-bg">🔌 Electric Motors</option>
                            <option value="Robotics" className="bg-dark-bg">🤖 Robotics Control</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Manufacturer / Brand</label>
                          <input 
                            required
                            type="text" 
                            placeholder="Powershine Core"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all font-bold placeholder:text-slate-700"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">List Price (₹)</label>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                            <input 
                              required
                              type="number" 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all font-display font-bold text-xl"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Current Stock Volume</label>
                          <input 
                            required
                            type="number" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all font-display font-bold text-xl"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block pl-1">Technical Briefing</label>
                        <textarea 
                          rows={3}
                          placeholder="Comprehensive details for engineering implementation..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary focus:bg-white/[0.08] transition-all text-sm font-medium resize-none placeholder:text-slate-700 leading-relaxed"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-10 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4 bg-white/[0.02]">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-5 rounded-2xl text-slate-300 font-black uppercase tracking-[0.2em] text-xs hover:bg-white/5 transition-all border border-white/5"
                >
                  Terminate Process
                </button>
                <button 
                  form="product-form"
                  type="submit"
                  className="bg-primary hover:bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs neon-glow-primary transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  {editingProduct ? 'Commit Changes' : 'Execute Creation'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
              onClick={() => setIsDeleteModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass p-10 rounded-[3rem] border-white/10 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/20">
                <Trash2 className="text-red-500" size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-bold text-white tracking-tight">Erase Entry?</h3>
                <p className="text-slate-400 text-sm font-medium px-4">
                  Confirming this action will permanently remove the data identifier from the system cluster. This cannot be reversed.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 neon-glow-red"
                >
                  Delete Permanently
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full bg-white/5 text-slate-400 hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-white/5"
                >
                  Maintain Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
