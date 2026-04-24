import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2, ShoppingCart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useStore();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
          <Heart className="text-slate-700" size={48} />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Your wishlist is empty</h1>
        <p className="text-slate-500 mb-10 text-lg">Save your favorite industrial components here.</p>
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-display font-bold text-white mb-12">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistProducts.map(product => (
          <div key={product.id} className="glass p-6 rounded-[2.5rem] border-white/5 group hover:border-primary/20 transition-all duration-500">
            <div className="aspect-square rounded-3xl overflow-hidden mb-6 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">{product.name}</h3>
            <p className="text-slate-500 text-sm mb-6">{product.brand}</p>
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <p className="text-2xl font-display font-bold text-primary">₹{product.price.toLocaleString()}</p>
              <button 
                onClick={() => addToCart(product)}
                className="bg-primary text-white p-4 rounded-2xl neon-glow-primary hover:scale-110 transition-all"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
