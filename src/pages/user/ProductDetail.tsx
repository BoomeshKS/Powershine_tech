import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, Star, MessageSquare, User as UserIcon, Facebook, Twitter, MessageCircle, Link as LinkIcon, Info, Settings as SettingsIcon, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, addReview } = useStore();
  const { user } = useAuth();
  const product = products.find(p => p.id === id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'shipping'>('info');

  if (!product) return <div className="p-20 text-center text-white">Product not found</div>;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    addReview(product.id, {
      userId: user.id,
      userName: user.name,
      rating,
      comment
    });
    setComment('');
    setRating(5);
  };

  const shareUrl = window.location.href;
  const shareText = `Check out ${product.name} on Powershine Tech!`;

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary mb-12 font-bold">
        <ArrowLeft size={20} /> Back to Catalog
      </Link>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="glass rounded-[3rem] border-white/5 overflow-hidden aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-8">
          <div>
            <span className="text-primary text-sm font-bold uppercase tracking-widest">{product.category}</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-slate-500 text-xs font-bold">
                {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
              </span>
              <button 
                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline ml-2"
              >
                Leave a Review
              </button>
            </div>
            <h1 className="text-5xl font-display font-bold text-white mt-2">{product.name}</h1>
            <p className="text-slate-500 text-xl mt-2">{product.brand}</p>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-4xl font-display font-bold text-primary">₹{product.price.toLocaleString()}</p>
            {product.discountPrice && (
              <p className="text-xl text-slate-500 line-through">₹{product.discountPrice.toLocaleString()}</p>
            )}
          </div>

          <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
              {[
                { id: 'info', label: 'Overview', icon: Info },
                { id: 'specs', label: 'Tech Specs', icon: SettingsIcon },
                { id: 'shipping', label: 'Shipping', icon: Truck },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-lg neon-glow-primary" 
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  )}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-slate-400 text-lg leading-relaxed"
                  >
                    {product.description}
                  </motion.div>
                )}

                {activeTab === 'specs' && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                        <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">{key}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                    {Object.keys(product.specifications).length === 0 && (
                      <p className="text-slate-500 italic text-center py-8">No specific technical data available.</p>
                    )}
                  </motion.div>
                )}

                {activeTab === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-xl text-accent">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold mb-1">Standard Delivery</p>
                        <p className="text-slate-500 text-sm">3-5 business days within India. Fully tracked and insured.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold mb-1">Industrial Warranty</p>
                        <p className="text-slate-500 text-sm">1-year standard manufacturing warranty covers all components.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Share this product</p>
            <div className="flex gap-3">
              <button 
                onClick={shareOnWhatsApp}
                className="w-12 h-12 glass rounded-xl border-white/10 flex items-center justify-center text-slate-400 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all hover:scale-110"
                title="Share on WhatsApp"
              >
                <MessageCircle size={20} />
              </button>
              <button 
                onClick={shareOnFacebook}
                className="w-12 h-12 glass rounded-xl border-white/10 flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all hover:scale-110"
                title="Share on Facebook"
              >
                <Facebook size={20} />
              </button>
              <button 
                onClick={shareOnTwitter}
                className="w-12 h-12 glass rounded-xl border-white/10 flex items-center justify-center text-slate-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all hover:scale-110"
                title="Share on Twitter"
              >
                <Twitter size={20} />
              </button>
              <button 
                onClick={copyToClipboard}
                className="w-12 h-12 glass rounded-xl border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
                title="Copy Link"
              >
                <LinkIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews-section" className="mt-24 space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <MessageSquare className="text-primary" /> Customer Reviews
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex text-yellow-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <span className="text-white font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-slate-500 text-sm uppercase tracking-widest">({product.reviews?.length || 0} reviews)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-[2.5rem] border-white/5 sticky top-24">
              <h3 className="text-xl font-display font-bold text-white mb-6">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={cn(
                          "p-2.5 rounded-xl transition-all",
                          rating >= star ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" : "text-slate-600 bg-white/5 border-transparent",
                          "border"
                        )}
                      >
                        <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Your feedback</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this tech component..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all min-h-[150px] resize-none text-sm leading-relaxed"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition-all neon-glow-primary active:scale-95"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews
                .filter(r => r.isApproved)
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((review) => (
                  <div key={review.id} className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                          <UserIcon size={24} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{review.userName}</p>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">
                            {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-yellow-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-base">{review.comment}</p>
                  </div>
                ))
            ) : (
              <div className="text-center py-24 glass rounded-[3rem] border-white/5 bg-white/[0.02]">
                <MessageSquare size={64} className="text-slate-800 mx-auto mb-6 opacity-20" />
                <p className="text-slate-500 text-lg font-medium italic">Be the first to professionaly review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
