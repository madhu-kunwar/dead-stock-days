import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Heart, BookmarkPlus, ArrowLeft, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, fetchProducts } from '@/lib/api';
import { useFavorites } from '@/hooks/useFavorites';
import { useBucketlist } from '@/hooks/useBucketlist';
import EmailCapture from '@/components/EmailCapture';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleBucketlist, isInBucketlist } = useBucketlist();
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isProductLoading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">
          <h1 className="font-display text-4xl mb-4 text-muted-foreground">Loading Piece...</h1>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Piece Not Found</h1>
          <Link to="/drops" className="nav-link">Back to Collection →</Link>
        </div>
      </main>
    );
  }

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && !p.soldOut)
    .sort((a, b) => {
      // Prioritize same archive type and product category
      const scoreA = (a.archiveType === product.archiveType ? 2 : 0) + (a.productCategory === product.productCategory ? 1 : 0);
      const scoreB = (b.archiveType === product.archiveType ? 2 : 0) + (b.productCategory === product.productCategory ? 1 : 0);
      return scoreB - scoreA || Math.random() - 0.5;
    })
    .slice(0, 4);

  const whatsappMessage = encodeURIComponent(
    `Hi Dead Stock Days, I'm interested in acquiring the ${product.name} (Ref: ${product.id}).\n\n` +
    `• Price: Rs. ${product.price}\n` +
    `• Size: ${product.size || 'Unisex'}\n` +
    `• Collection: ${product.dropName}\n\n` +
    `Can you please confirm if this piece is still available?`
  );

  const instagramLink = `https://www.instagram.com/direct/t/17845963320653796/`;

  return (
    <main className="pt-20">
      {/* Back Link */}
      <div className="container mx-auto px-6 lg:px-12 py-6">
        <Link to="/drops" className="inline-flex items-center gap-2 nav-link">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>
      </div>

      {/* Product Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Gallery Column */}
            <div className="space-y-6">
              <div className="editorial-image bg-muted aspect-[4/5] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    src={product.images && product.images.length > activeImage ? product.images[activeImage] : product.image} 
                    alt={product.name}
                    className={`w-full h-full object-cover ${product.soldOut ? 'grayscale opacity-70' : ''}`}
                  />
                </AnimatePresence>
                
                {product.soldOut ? (
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                    <span className="sold-out-badge text-xs sm:text-sm">Out of Stock</span>
                  </div>
                ) : (
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                    <span className="quantity-badge text-xs sm:text-sm">Only {product.quantity} Remaining</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mask-fade-edges">
                  {product.images.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`
                        relative flex-shrink-0 w-20 sm:w-24 aspect-[4/5] border transition-all duration-300
                        ${activeImage === idx ? 'border-accent p-1' : 'border-border grayscale hover:grayscale-0'}
                      `}
                    >
                      <img src={url} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-2 sm:space-y-4">
                <span className="detail-label">{product.dropName}</span>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide leading-tight">{product.name}</h2>
                <p className="text-2xl sm:text-3xl font-light">Rs. {product.price}</p>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 sm:gap-8 py-6 sm:py-8 border-y border-border">
                {product.era && product.era !== 'None' && (
                  <div className="space-y-1">
                    <span className="detail-label text-[10px]">Era</span>
                    <p className="font-display text-lg sm:text-xl">{product.era}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="detail-label text-[10px]">Category</span>
                  <p className="font-display text-lg sm:text-xl">{product.productCategory || product.archiveType}</p>
                </div>
                <div className="space-y-1">
                  <span className="detail-label text-[10px]">Style</span>
                  <p className="font-display text-lg sm:text-xl">{product.style || 'Streetwear'}</p>
                </div>
                {product.brand && (
                  <div className="space-y-1">
                    <span className="detail-label text-[10px]">Brand</span>
                    <p className="font-display text-lg sm:text-xl">{product.brand}</p>
                  </div>
                )}
                {product.material && (
                  <div className="space-y-1">
                    <span className="detail-label text-[10px]">Material</span>
                    <p className="font-display text-lg sm:text-xl">{product.material}</p>
                  </div>
                )}
                {product.color && (
                  <div className="space-y-1">
                    <span className="detail-label text-[10px]">Colorway</span>
                    <p className="font-display text-lg sm:text-xl">{product.color}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="detail-label text-[10px]">Style</span>
                  <p className="font-display text-lg sm:text-xl">{product.style || 'Streetwear'}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="detail-label text-[10px]">Ref. ID</span>
                  <p className="font-display text-xs sm:text-sm text-muted-foreground uppercase">{product.id}</p>
                </div>
              </div>

              {/* Actions */}
              {product.soldOut ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This piece has been sold out. Add to your wishlist to be 
                    notified if similar pieces become available.
                  </p>
                  <button
                    onClick={() => toggleBucketlist(product.id)}
                    className={`btn-outline w-full ${isInBucketlist(product.id) ? 'border-accent text-accent' : ''}`}
                  >
                    <BookmarkPlus className="w-5 h-5" />
                    {isInBucketlist(product.id) ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <a 
                    href={`https://wa.me/9708366579?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-request w-full"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Request to Buy via WhatsApp
                  </a>
                  <a 
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full flex items-center justify-center gap-2"
                  >
                    DM on Instagram
                  </a>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`btn-outline w-full ${isFavorite(product.id) ? 'border-accent text-accent' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-accent' : ''}`} />
                    {isFavorite(product.id) ? 'Saved' : 'Save for Later'}
                  </button>
                </div>
              )}

              {/* Drop Info */}
              <div className="bg-muted p-6 space-y-2">
                <span className="detail-label">Drop Information</span>
                <p className="text-sm text-muted-foreground">
                  This piece was released as part of {product.dropName} on{' '}
                  {new Date(product.dropDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}. 
                  All purchases are handled manually via WhatsApp or Instagram DM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <span className="detail-label">Explore More</span>
                <h2 className="section-title">Related Pieces</h2>
              </div>
              <Link to="/drops" className="nav-link exclusive-border pb-1">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <EmailCapture />
    </main>
  );
};

export default ProductDetail;
