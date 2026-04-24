import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Zap, 
  ArrowRight, 
  ChevronRight,
  LayoutGrid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const { products, wishlist } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Newest') return b.id.localeCompare(a.id);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Industrial Catalog</h1>
          <p className="text-slate-400">Premium components for your automation needs.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "p-3 rounded-2xl border transition-all md:hidden",
              isFilterOpen ? "bg-primary border-primary text-white" : "bg-white/5 border-white/10 text-slate-400"
            )}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className={cn(
          "lg:w-64 space-y-10 lg:block",
          isFilterOpen ? "block" : "hidden"
        )}>
          <div>
            <h4 className="text-white font-display font-bold mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" /> Categories
            </h4>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    selectedCategory === cat 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-bold mb-6">Price Range</h4>
            <div className="space-y-4">
              <input type="range" className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>₹0</span>
                <span>₹5,00,000+</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <Zap className="text-primary mb-4" size={24} />
            <h5 className="text-white font-bold mb-2">Need Help?</h5>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Our technical experts are available for consultation.</p>
            <button className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold neon-glow-primary">Contact Support</button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Controls */}
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-primary text-white" : "text-slate-500 hover:text-white")}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-primary text-white" : "text-slate-500 hover:text-white")}
              >
                <List size={20} />
              </button>
              <span className="text-sm text-slate-500 ml-4">
                Showing <span className="text-white font-bold">{filteredProducts.length}</span> results
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 hidden sm:inline">Sort by:</span>
              <select 
                className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option className="bg-dark-bg">Featured</option>
                <option className="bg-dark-bg">Newest</option>
                <option className="bg-dark-bg">Price: Low to High</option>
                <option className="bg-dark-bg">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className={cn(
            "grid gap-8",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "glass rounded-[2.5rem] border-white/5 overflow-hidden group hover:border-primary/30 transition-all duration-500",
                    viewMode === 'list' && "flex flex-col md:flex-row"
                  )}
                >
                  <div className={cn(
                    "relative overflow-hidden",
                    viewMode === 'grid' ? "aspect-square" : "md:w-72 aspect-square"
                  )}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                    </div>
                    {product.stock < 5 && (
                      <div className="absolute bottom-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        Low Stock
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-primary text-xs font-bold uppercase tracking-widest">{product.category}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-bold">4.8</span>
                        </div>
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-slate-500 text-xs mt-1 font-medium">{product.brand}</p>
                    </div>

                    {viewMode === 'list' && (
                      <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-display font-bold text-white">₹{product.price.toLocaleString()}</p>
                        {product.discountPrice && (
                          <p className="text-xs text-slate-500 line-through">₹{product.discountPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 glass rounded-[2.5rem] border-white/5">
              <Search className="mx-auto text-slate-700 mb-4" size={48} />
              <h3 className="text-2xl font-display font-bold text-white mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
