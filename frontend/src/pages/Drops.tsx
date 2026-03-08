import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const [showSoldOut, setShowSoldOut] = useState(true);

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
            <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl">Collection</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Each piece is sourced, verified, and presented with intention. 
              When quantities reach zero, items are permanently removed from store.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-accent">{availableCount} Available</span>
              <span className="text-muted-foreground">{soldOutCount} Archived</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center gap-8">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <span className="detail-label">Type</span>
              <div className="flex flex-wrap gap-2">
                {collectionTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setCollectionFilter(type)}
                    className={`px-3 py-1.5 text-xs tracking-widest uppercase transition-colors ${
                      collectionFilter === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Era Filter */}
            <div className="flex items-center gap-4">
              <span className="detail-label">Era</span>
              <div className="flex flex-wrap gap-2">
                {eras.map(era => (
                  <button
                    key={era}
                    onClick={() => setEraFilter(era)}
                    className={`px-3 py-1.5 text-xs tracking-widest uppercase transition-colors ${
                      eraFilter === era
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {era}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Filter */}
            <div className="flex items-center gap-4">
              <span className="detail-label">Style</span>
              <div className="flex flex-wrap gap-2">
                {styles.map(style => (
                  <button
                    key={style}
                    onClick={() => setStyleFilter(style)}
                    className={`px-3 py-1.5 text-xs tracking-widest uppercase transition-colors ${
                      styleFilter === style
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Show Sold Out Toggle */}
            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={showSoldOut}
                onChange={(e) => setShowSoldOut(e.target.checked)}
                className="w-4 h-4 accent-accent bg-muted border-border"
              />
              <span className="text-xs tracking-wide text-muted-foreground">Show Sold Out</span>
            </label>
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
                onClick={() => { setCollectionFilter('All'); setEraFilter('All'); setStyleFilter('All'); setShowSoldOut(true); }}
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
