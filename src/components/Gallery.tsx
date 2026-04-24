import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Loader2, Image as ImageIcon, X, Maximize2, Filter } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const CATEGORIES = ["All", "Repair", "Automation", "Testing", "Workshop", "Custom", "Textile"];

const INITIAL_GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800",
    title: "Precision Micro-Soldering",
    category: "Repair",
    height: "h-80",
    alt: "A senior technician performing precision micro-soldering on a multi-layer industrial motherboard using a temperature-controlled station and high-magnification optics."
  },
  {
    url: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=800",
    title: "Modular PLC Architecture",
    category: "Automation",
    height: "h-64",
    alt: "Integration of high-density modular PLC units within a stainless steel industrial enclosure, featuring color-coded shielded signal cabling and secondary surge protection."
  },
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    title: "Power Stage Diagnostics",
    category: "Testing",
    height: "h-96",
    alt: "Advanced diagnostic session of a high-power IGBT inverter stage using a 4-channel digital storage oscilloscope and precision differential probes to verify switching timings."
  },
  {
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    title: "HMI Interface Deployment",
    category: "Automation",
    height: "h-72",
    alt: "Deployment of a customized 15-inch industrial HMI touchscreen running optimized SCADA software for real-time monitoring of a multi-axial production line."
  },
  {
    url: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800",
    title: "Synchronous Weaving Logic",
    category: "Textile",
    height: "h-80",
    alt: "Proprietary electronic control logic module designed for high-speed synchronous weaving machines, capable of processing sub-millisecond motion control signals."
  },
  {
    url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800",
    title: "Rework Environment",
    category: "Workshop",
    height: "h-64",
    alt: "Our controlled-environment rework laboratory equipped with BGA infrared heaters, ultrasonic cleaners, and ESD-safe surfaces for critical component recovery."
  }
];

export default function Gallery() {
  const [images, setImages] = useState(INITIAL_GALLERY_IMAGES);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<typeof INITIAL_GALLERY_IMAGES[0] | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const filteredImages = useMemo(() => {
    if (activeFilter === "All") return images;
    return images.filter(img => img.category === activeFilter);
  }, [images, activeFilter]);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const defaultPrompts = [
        "A high-tech industrial circuit board with glowing green traces and precision components, macro photography, cinematic lighting",
        "Close-up of a robotic arm performing precision soldering on a PCB, industrial workshop setting",
        "An array of industrial PLC controllers in a clean, modern control room, soft bokeh background",
        "Macro shot of a high-power semiconductor module with heat sink, technical engineering aesthetic",
        "A futuristic industrial automation panel with glowing LED indicators and neat wiring"
      ];
      
      const randomDefault = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
      const finalPrompt = prompt.trim() || randomDefault;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Industrial electronics, professional photography, high detail, ${finalPrompt}` }],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addToGallery = () => {
    if (generatedImage) {
      const newImage = {
        url: generatedImage,
        title: prompt || "AI Generated Component",
        category: "Custom",
        height: Math.random() > 0.5 ? "h-80" : "h-64",
        alt: prompt || "AI generated industrial electronic component"
      };
      setImages([newImage, ...images]);
      setGeneratedImage(null);
      setPrompt("");
      setShowGenerator(false);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <span className="text-primary font-display font-bold tracking-widest uppercase text-sm">Visual Showcase</span>
            <h2 className="text-4xl lg:text-6xl font-display font-bold mt-4">Our <span className="text-primary">Work</span> Gallery</h2>
          </div>
          
          <button 
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-6 py-3 rounded-xl font-bold transition-all border border-primary/20 neon-glow-primary group"
          >
            <Sparkles size={18} className="group-hover:animate-pulse" />
            AI Image Studio
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <div className="flex items-center gap-2 text-slate-500 mr-2">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Filter:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all border",
                activeFilter === cat 
                  ? "bg-primary border-primary text-white neon-glow-primary" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, index) => (
              <motion.div
                layout
                key={img.url + index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.5, 
                  delay: (index % 3) * 0.1,
                  ease: "easeOut"
                }}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative rounded-3xl overflow-hidden group cursor-pointer break-inside-avoid neon-border-primary",
                  img.height
                )}
              >
                <img 
                  src={img.url} 
                  alt={img.alt} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visible Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-primary font-display font-bold text-xs uppercase tracking-widest mb-1 block">
                        {img.category}
                      </span>
                      <h3 className="text-white font-display font-bold text-lg leading-tight">
                        {img.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSelectedImage(null);
                  setIsZoomed(false);
                }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              >
                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    setIsZoomed(false);
                  }}
                  className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold"
                >
                  CLOSE <X size={24} />
                </button>
                <div className="relative w-full h-full rounded-3xl overflow-hidden neon-glow-primary bg-black/40 group/lightbox">
                  <motion.div
                    animate={{ scale: isZoomed ? 2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full h-full cursor-zoom-in"
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <img 
                      src={selectedImage.url} 
                      alt={selectedImage.alt} 
                      className={cn(
                        "w-full h-full transition-all duration-300",
                        isZoomed ? "object-cover" : "object-contain"
                      )}
                    />
                  </motion.div>
                  
                  {/* Zoom Indicator */}
                  <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2 pointer-events-none opacity-0 group-hover/lightbox:opacity-100 transition-opacity">
                    <Maximize2 size={14} />
                    {isZoomed ? "CLICK TO ZOOM OUT" : "CLICK TO ZOOM IN"}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <span className="text-primary font-display font-bold uppercase tracking-widest text-sm mb-2 block">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                      {selectedImage.title}
                    </h3>
                    <p className="text-slate-300 max-w-2xl">
                      {selectedImage.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AI Generator Modal */}
        <AnimatePresence>
          {showGenerator && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGenerator(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl glass-dark rounded-3xl p-8 border-primary/20 overflow-hidden"
              >
                <button 
                  onClick={() => setShowGenerator(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white">AI Image Studio</h3>
                    <p className="text-slate-400 text-sm">Generate custom industrial visuals for your gallery</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Describe the component or scene</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Leave empty for a surprise industrial visual..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-primary outline-none transition-all pr-12"
                      />
                      <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    </div>
                  </div>

                  {generatedImage ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/30 neon-glow-primary">
                        <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={addToGallery}
                          className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all"
                        >
                          <Plus size={20} /> Add to Gallery
                        </button>
                        <button 
                          onClick={() => setGeneratedImage(null)}
                          className="px-6 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={generateImage}
                      disabled={isGenerating}
                      className="w-full bg-primary disabled:opacity-50 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] neon-glow-primary"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          Generating Visual...
                        </>
                      ) : (
                        <>
                          <Sparkles size={24} />
                          {prompt.trim() ? "Generate Image" : "Surprise Me!"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
