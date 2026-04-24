import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MessageSquare, ChevronRight, LayoutGrid } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../constants';
import { useStore } from '../context/StoreContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const recommendedProducts = useMemo(() => PRODUCTS.slice(0, 8), []);

  const handleEnquire = (productName: string) => {
    toast.success(`Enquiry sent for ${productName}! We will contact you soon.`);
  };

  return (
    <section id="products" className="py-24 bg-dark-bg">
      <div className="container mx-auto px-4">
        {/* Search Bar (SOHO Style) */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <select 
              value={activeCategory}
              onChange={(e) => {
                setActiveCategory(e.target.value);
                setSearchType(e.target.value);
              }}
              className="bg-transparent text-white px-6 py-4 border-r border-white/10 focus:outline-none cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="All" className="bg-dark-bg">All Categories</option>
              {PRODUCT_CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name} className="bg-dark-bg">{cat.name}</option>
              ))}
            </select>
            <div className="flex-1 relative">
              <input 
                type="text"
                placeholder="Search products by name, model, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white px-6 py-4 focus:outline-none"
              />
            </div>
            <button className="bg-primary-green text-dark-bg px-8 py-4 font-bold flex items-center gap-2 hover:bg-primary-green/90 transition-colors">
              <Search size={20} />
              SEARCH
            </button>
          </div>
        </div>

        {/* Product Category Tiles (SOHO Style) */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Filter className="text-primary-green" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PRODUCT_CATEGORIES.map((cat, index) => {
              const IconComponent = (Icons as any)[cat.icon] || Icons.Box;
              return (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`p-6 rounded-2xl border transition-all duration-300 text-left group ${
                    activeCategory === cat.name
                      ? 'bg-primary-green border-primary-green text-dark-bg shadow-[0_0_20px_rgba(0,255,157,0.3)]'
                      : 'bg-white/5 border-white/10 text-white hover:border-primary-green/50'
                  }`}
                >
                  <div className={`mb-4 p-3 rounded-xl inline-block transition-colors ${
                    activeCategory === cat.name ? 'bg-dark-bg/10' : 'bg-primary-green/10 text-primary-green'
                  }`}>
                    <IconComponent size={24} />
                  </div>
                  <h3 className="font-bold mb-1">{cat.name}</h3>
                  <p className={`text-[10px] line-clamp-1 ${
                    activeCategory === cat.name ? 'text-dark-bg/70' : 'text-gray-400'
                  }`}>
                    {cat.examples}
                  </p>
                </motion.button>
              );
            })}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveCategory('All')}
              className={`p-6 rounded-2xl border transition-all duration-300 text-left ${
                activeCategory === 'All'
                  ? 'bg-primary-green border-primary-green text-dark-bg shadow-[0_0_20px_rgba(0,255,157,0.3)]'
                  : 'bg-white/5 border-white/10 text-white hover:border-primary-green/50'
              }`}
            >
              <div className={`mb-4 p-3 rounded-xl inline-block ${
                activeCategory === 'All' ? 'bg-dark-bg/10' : 'bg-primary-green/10 text-primary-green'
              }`}>
                <LayoutGrid size={24} />
              </div>
              <h3 className="font-bold mb-1">All Products</h3>
              <p className={`text-[10px] ${activeCategory === 'All' ? 'text-dark-bg/70' : 'text-gray-400'}`}>
                View our entire catalog
              </p>
            </motion.button>
          </div>
        </div>

        {/* Recommended Products Strip */}
        <div className="mb-20 relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Recommended Products
            </h2>
          </div>
          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 3000 }}
              navigation
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="recommended-swiper"
            >
              {recommendedProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 group hover:border-primary-green/50 transition-all h-full">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-400 text-[10px] mb-3">{product.category}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Full Product Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {activeCategory === 'All' ? 'Full Catalog' : activeCategory}
              <span className="ml-4 text-sm font-normal text-gray-400">
                ({filteredProducts.length} items found)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group bg-dark-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary-green/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.brand !== 'Generic' && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-dark-bg/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                          {product.brand}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary-green">
                        {product.category}
                      </span>
                    </div>
                    
                    <Link to={`/product/${product.id}`} className="group/title">
                      <h3 className="text-lg font-bold text-white mb-2 transition-colors group-hover/title:text-primary-green line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-400 text-[10px] mb-4 line-clamp-2 leading-relaxed h-7">
                      {product.description}
                    </p>
                    
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => handleEnquire(product.name)}
                        className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white text-[9px] font-bold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Icons.MessageSquare size={12} />
                        Enquire
                      </button>
                      <Link 
                        to={`/product/${product.id}`}
                        className="flex-1 py-2.5 bg-primary-green text-dark-bg text-[9px] font-bold rounded-lg hover:bg-primary-green/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-green/20"
                      >
                        Details
                        <Icons.ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
