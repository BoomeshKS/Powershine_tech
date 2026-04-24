import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, ShieldCheck, Truck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
        <CreditCard className="text-primary" size={48} />
      </div>
      <h1 className="text-4xl font-display font-bold text-white mb-4">Checkout</h1>
      <p className="text-slate-500 mb-10 text-lg">Your checkout process is being handled securely.</p>
      <button 
        onClick={() => {
          toast.success('Checkout successful!');
          navigate('/orders');
        }}
        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg neon-glow-primary hover:scale-105 transition-all"
      >
        Complete Purchase <Zap size={20} />
      </button>
    </div>
  );
}
