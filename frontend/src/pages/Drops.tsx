import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import EmailCapture from '@/components/EmailCapture';
import { CollectionFilter, EraFilter, StyleFilter } from '@/types/product';

const Drops = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>('All');
  const [eraFilter, setEraFilter] = useState<EraFilter>('All');
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('All');
  const [showSoldOut, setShowSoldOut] = useState(false);

  const collectionTypes: CollectionFilter[] = ['All', 'T-Shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Coats', 'Jeans', 'Pants / Trousers', 'Shorts', 'Activewear', 'Tank tops', 'Crop tops', 'Cardigan', 'Formal Wear', 'Accessories'];
  const eras: EraFilter[] = ['All', '80s', '90s', '2000s', 'None'];
  const styles: StyleFilter[] = ['All', 'Streetwear', 'Formal', 'Casual', 'Outerwear', 'Sporty', 'Baggy'];

  const filteredProducts = products.filter(product => {
    if (collectionFilter !== 'All' && (product.productCategory !== collectionFilter && product.archiveType !== collectionFilter)) return false;
    const effectiveEra = product.era || 'None';
    if (eraFilter !== 'All' && effectiveEra !== eraFilter) return false;
    if (styleFilter !== 'All' && (product.style || 'Streetwear') !== styleFilter) return false;
    if (!showSoldOut && product.soldOut) return false;
    return true;
  });

  const availableCount = products.filter(p => !p.soldOut).length;
  const soldOutCount = products.filter(p => p.soldOut).length;

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <span className="detail-label">The Collection</span>
            <h1 className="hero-title text-5xl sm:text-7xl md:text-8xl leading-none">Collection</h1>
            <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed max-w-xl">
              Each piece is sourced, verified, and presented with intention. 
              When quantities reach zero, items are permanently removed from store.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <span className="text-accent">{availableCount} Available</span>
              <span className="text-muted-foreground">{soldOutCount} Archived</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="md:sticky top-20 bg-background/95 backdrop-blur-sm z-30 border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Main Category Filter - Horizontal Scroll */}
          <div className="flex items-center border-b border-border/50 relative">
            <span className="detail-label mr-8 hidden md:block shrink-0">Type</span>
            <div className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-4 sm:py-6 lg:mask-fade-edges">
              {collectionTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setCollectionFilter(type)}
                  className={`text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 relative pb-1 ${
                    collectionFilter === type
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {type}
                  {collectionFilter === type && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-px bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-6 gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
              {/* Era Selection */}
              <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
                <span className="detail-label shrink-0">Era</span>
                <div className="flex gap-3">
                  {eras.map(era => (
                    <button
                      key={era}
                      onClick={() => setEraFilter(era)}
                      className={`text-[10px] tracking-widest uppercase px-3 py-1 border transition-all ${
                        eraFilter === era
                          ? 'border-accent text-accent bg-accent/5'
                          : 'border-border text-muted-foreground hover:border-muted-foreground'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
                <span className="detail-label shrink-0">Style</span>
                <div className="flex gap-2 sm:gap-3">
                  {styles.map(style => (
                    <button
                      key={style}
                      onClick={() => setStyleFilter(style)}
                      className={`text-[9px] sm:text-[10px] tracking-widest uppercase px-2 sm:px-3 py-1 border transition-all whitespace-nowrap ${
                        styleFilter === style
                          ? 'border-accent text-accent bg-accent/5'
                          : 'border-border text-muted-foreground hover:border-muted-foreground'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sold Out Toggle & Clear */}
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pt-2 sm:pt-0">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-7 h-3.5 sm:w-8 sm:h-4 bg-muted border border-border transition-colors group-hover:border-muted-foreground">
                  <div className={`absolute top-0.5 left-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 transition-all duration-300 ${
                    showSoldOut ? 'translate-x-[calc(100% + 4px)] sm:translate-x-4 bg-accent' : 'translate-x-0 bg-muted-foreground'
                  }`} />
                </div>
                <input
                  type="checkbox"
                  checked={showSoldOut}
                  onChange={(e) => setShowSoldOut(e.target.checked)}
                  className="hidden"
                />
                <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                  Archive Pieces
                </span>
              </label>

              {(collectionFilter !== 'All' || eraFilter !== 'All' || styleFilter !== 'All') && (
                <button 
                  onClick={() => { setCollectionFilter('All'); setEraFilter('All'); setStyleFilter('All'); setShowSoldOut(false); }}
                  className="text-[9px] sm:text-[10px] tracking-widest uppercase text-accent hover:underline underline-offset-4"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No pieces match your filters.</p>
              <button 
                onClick={() => { setCollectionFilter('All'); setEraFilter('All'); setStyleFilter('All'); setShowSoldOut(false); }}
                className="mt-4 nav-link"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <EmailCapture />
    </main>
  );
};

export default Drops;
