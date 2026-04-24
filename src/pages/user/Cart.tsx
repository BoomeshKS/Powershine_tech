import React, { useState } from 'react';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Zap,
  CreditCard,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { products, cart, updateCartQuantity, removeFromCart, clearCart, addOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('123 Industrial Area, Phase II, Bangalore, KA 560001');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Map cart items to include product details to avoid NaN
  const cartWithDetails = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      name: product?.name || 'Unknown Product',
      price: product?.price || 0,
      image: product?.image || '',
      brand: product?.brand || '',
      category: product?.category || ''
    };
  });

  const subtotal = cartWithDetails.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to complete your order');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsCheckingOut(true);
    // Simulate payment processing
    setTimeout(() => {
      const newOrder = {
        userId: user.id,
        items: [...cart],
        total,
        status: 'Pending' as const,
        date: new Date().toISOString(),
        shippingAddress,
        paymentMethod
      };
      
      addOrder(newOrder);
      clearCart();
      setIsCheckingOut(false);
      toast.success('Order placed successfully!');
      navigate('/orders');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
          <ShoppingBag className="text-slate-700" size={48} />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-slate-500 mb-10 text-lg">Looks like you haven't added any industrial components yet.</p>
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
      <h1 className="text-4xl font-display font-bold text-white mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cartWithDetails.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col sm:flex-row items-center gap-6 group hover:border-primary/20 transition-all duration-500"
              >
                <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{item.brand} • {item.category}</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center text-white font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <p className="text-2xl font-display font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-6">
            <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:underline">
              <ChevronRight className="rotate-180" size={20} /> Continue Shopping
            </Link>
            <button 
              onClick={clearCart}
              className="text-slate-500 hover:text-red-400 font-bold transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-8">
            <h3 className="text-2xl font-display font-bold text-white">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-white font-bold">{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%)</span>
                <span className="text-white font-bold">₹{tax.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-3xl font-display font-bold text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> Shipping Address
                </label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-primary resize-none"
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard size={14} /> Payment Method
                </label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-primary appearance-none cursor-pointer"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option className="bg-dark-bg">Credit Card</option>
                  <option className="bg-dark-bg">UPI / Net Banking</option>
                  <option className="bg-dark-bg">Cash on Delivery</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] neon-glow-primary disabled:opacity-50 disabled:scale-100"
            >
              {isCheckingOut ? (
                <RefreshCw className="animate-spin" size={24} />
              ) : (
                <>Checkout Now <ArrowRight size={24} /></>
              )}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-3xl border-white/5 flex flex-col items-center text-center gap-2">
              <ShieldCheck className="text-primary" size={24} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Payment</span>
            </div>
            <div className="glass p-4 rounded-3xl border-white/5 flex flex-col items-center text-center gap-2">
              <Truck className="text-accent" size={24} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
