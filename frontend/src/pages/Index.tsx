import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import heroImage from '@/assets/hero-image.jpg';
import { fetchProducts, updateProduct } from '@/lib/api';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import EmailCapture from '@/components/EmailCapture';
import { useFavorites } from '@/hooks/useFavorites';
import { useBucketlist } from '@/hooks/useBucketlist';
import { Heart, BookmarkPlus } from 'lucide-react';

// Featured Slider Component
const FeaturedSlider = ({ products }: { products: Product[] }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleBucketlist, isInBucketlist } = useBucketlist();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (!products.length) return null;

  return (
    <section className="py-24 border-b border-border bg-card/10">
      <div className="container-editorial">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="detail-label mb-2 block text-accent">Curated Selection</span>
            <h2 className="hero-title text-5xl md:text-6xl tracking-tighter uppercase">Featured<br/>Collection</h2>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={scrollPrev}
              className="p-4 border border-border hover:bg-muted transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={scrollNext}
              className="p-4 border border-border hover:bg-muted transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0"
              >
                <div className="group h-full flex flex-col">
                  <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-card border border-border group">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Action Buttons - Always visible */}
                    <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
                      {product.soldOut ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleBucketlist(product.id);
                          }}
                          className={`p-3 backdrop-blur-md border border-white/10 transition-colors hover:bg-white/20 ${
                            isInBucketlist(product.id) ? 'bg-accent text-accent-foreground' : 'bg-black/40 text-white'
                          }`}
                        >
                          <BookmarkPlus size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className={`p-3 backdrop-blur-md border border-white/10 transition-colors hover:bg-white/20 ${
                            isFavorite(product.id) ? 'bg-accent text-accent-foreground' : 'bg-black/40 text-white'
                          }`}
                        >
                          <Heart 
                            size={18}
                            className={isFavorite(product.id) ? 'fill-current' : ''}
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Background Ghost Text - 'Text Photo' Aesthetic */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-full flex items-center justify-center opacity-[0.03]">
                      <span className="font-display text-[25vw] leading-none uppercase select-none rotate-90 sm:rotate-0">
                        {product.archiveType}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    
                    {product.soldOut && (
                      <span className="absolute top-4 right-4 sold-out-badge z-10">Sold Out</span>
                    )}

                    {/* Always Visible Text Info */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                       <span className="text-accent text-[10px] tracking-[0.4em] uppercase mb-4 block animate-in fade-in slide-in-from-bottom-2 duration-700">
                         {product.productCategory || product.archiveType}
                       </span>
                       <h3 className="text-white font-display text-4xl lg:text-5xl uppercase leading-[0.9] tracking-tighter mb-4">
                         {product.name}
                       </h3>
                       <div className="flex items-center gap-4 opacity-100 group-hover:opacity-100 transition-opacity duration-500">
                          <span className="h-px w-8 bg-accent" />
                          <span className="detail-label text-[10px]">View Archive Piece</span>
                       </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const featuredProducts = products 
    ? products.filter(p => !p.soldOut && (p.featured || p.shoppingCategory === 'Best Sellers')).slice(0, 6)
    : [];

  // If no "Featured" tag exists, just take top 6
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.filter(p => !p.soldOut).slice(0, 6);

  const allProducts = products.filter(p => !p.soldOut);
  const currentVisibleProducts = allProducts.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const hasMore = visibleCount < allProducts.length;

  return (
    <main>
      {/* Hero Section - Keeps the premium editorial feel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-border">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Dead Stock Days"
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
          <div className="absolute inset-0 radial-vignette" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="detail-label text-accent mb-8 block tracking-[0.4em]">Collection Sequence 001</span>
            <h1 className="hero-title text-[12vw] sm:text-[10vw] leading-[0.85] mb-12 select-none pointer-events-none">
              DEADSTOCK<br />DAYS
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link to="/drops" className="btn-request px-16 text-sm py-5">
                Explore Full Collection
              </Link>
              <div className="h-px w-12 bg-border hidden sm:block" />
              <p className="text-muted-foreground text-xs uppercase tracking-widest max-w-[200px]">
                Limited pieces. Verified history. Permanent archival.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-12 bg-border relative"
          >
            <div className="absolute top-0 left-0 w-full h-1/2 bg-accent opacity-50" />
          </motion.div>
        </div>
      </section>

      {/* Featured Slider */}
      <FeaturedSlider products={displayFeatured} />

      {/* Core Features / Philosophy */}
      {/* <section className="py-32 border-b border-border bg-card/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <span className="text-accent text-[10px] tracking-[0.4em] uppercase">01 / Selection</span>
              <h3 className="font-display text-4xl leading-tight">Curated<br/>Archive</h3>
              <p className="text-muted-foreground text-sm leading-relaxed uppercase tracking-widest opacity-80">
                Every piece is individually sourced and verified for authenticity and historical relevance.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-accent text-[10px] tracking-[0.4em] uppercase">02 / Sourcing</span>
              <h3 className="font-display text-4xl leading-tight">Global<br/>Network</h3>
              <p className="text-muted-foreground text-sm leading-relaxed uppercase tracking-widest opacity-80">
                We collect from the silent corners of the world, following the trail of forgotten deadstock.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-accent text-[10px] tracking-[0.4em] uppercase">03 / Legacy</span>
              <h3 className="font-display text-4xl leading-tight">Permanent<br/>Archival</h3>
              <p className="text-muted-foreground text-sm leading-relaxed uppercase tracking-widest opacity-80">
                Once a piece finds its owner, it is removed from our collection forever. No restocks.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Inventory Title */}
      <section className="pt-32 pb-12 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-end justify-between border-b border-border pb-12 gap-8">
                <div className="max-w-xl">
                    <span className="detail-label block mb-4">Latest Arrivals</span>
                    <h2 className="hero-title text-5xl md:text-6xl tracking-tight uppercase">The Collection</h2>
                    <p className="text-muted-foreground mt-6 leading-relaxed">
                        Every garment passed through our selection process. Extremely rare, unworn vintage and curated items from global fashion periods.
                    </p>
                </div>
                <div className="text-right">
                    <span className="font-display text-7xl leading-none text-muted-foreground opacity-10 uppercase block">Total Items: {products.length}</span>
                </div>
            </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 animate-pulse">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="space-y-4">
                        <div className="aspect-[4/5] bg-muted w-full border border-border" />
                        <div className="h-4 bg-muted w-2/3" />
                        <div className="h-3 bg-muted w-1/3" />
                    </div>
                ))}
            </div>
          ) : (
            <>
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20"
              >
                <AnimatePresence mode='popLayout'>
                  {currentVisibleProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {hasMore && (
                <div className="mt-24 flex justify-center border-t border-border pt-24">
                  <button 
                    onClick={handleShowMore}
                    className="group relative px-24 py-6 border border-border hover:bg-foreground hover:text-background transition-colors duration-500 overflow-hidden"
                  >
                    <span className="relative z-10 detail-label uppercase text-sm tracking-[0.3em]">Load More Pieces</span>
                    <div className="absolute bottom-0 left-0 h-1 bg-accent w-0 group-hover:w-full transition-all duration-700" />
                  </button>
                </div>
              )}
              
              {!hasMore && allProducts.length > 0 && (
                <div className="mt-24 text-center py-12 border-y border-border/10">
                   <p className="detail-label text-muted-foreground opacity-40">EndOfCollection_Sequence_001</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Brand Ethos Card */}
      <section className="py-48 px-6 lg:px-12 bg-muted relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 hidden lg:block">
            <span className="font-display text-[20vw] select-none leading-none">DSTD</span>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl space-y-12">
            <span className="text-accent text-xs tracking-[0.5em] uppercase">The Deadstock Promise</span>
            <h2 className="hero-title text-6xl leading-[0.9]">0% RESTOCK.<br/>100% EXCLUSIVE.</h2>
            <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-lg">
                We believe in the power of a one-of-a-kind wardrobe. When a piece sells out, it leaves the market forever. We source from forgotten stocks, private collections, and the silent corners of our sources.
            </p>
            <Link to="/about" className="nav-link exclusive-border inline-block pb-2">
                Discover the story →
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer/Capture */}
      <EmailCapture />
    </main>
  );
};

export default Index;
