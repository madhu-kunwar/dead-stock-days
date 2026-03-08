import { Link } from 'react-router-dom';
import { Heart, BookmarkPlus } from 'lucide-react';
import { Product } from '@/types/product';
import { useFavorites } from '@/hooks/useFavorites';
import { useBucketlist } from '@/hooks/useBucketlist';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleBucketlist, isInBucketlist } = useBucketlist();

  return (
    <div className="group editorial-card">
      <Link to={`/product/${product.id}`} className="block">
        <div className="editorial-image bg-muted">
          <img 
            src={product.image} 
            alt={product.name}
            className={product.soldOut ? 'grayscale opacity-70' : ''}
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {product.soldOut ? (
              <span className="sold-out-badge text-[9px] sm:text-xs">Sold Out</span>
            ) : (
              <span className="quantity-badge text-[9px] sm:text-xs">Only {product.quantity} Left</span>
            )}
          </div>

          {/* Action Buttons - Always Visible for Accessibility */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 transition-all duration-300">
            {product.soldOut ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleBucketlist(product.id);
                }}
                className={`p-2 backdrop-blur-md border border-white/10 transition-colors hover:bg-white/20 ${
                  isInBucketlist(product.id) ? 'bg-accent/80 text-accent-foreground' : 'bg-black/40 text-white'
                }`}
                title="Add to Wishlist"
              >
                <BookmarkPlus className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className={`p-2 backdrop-blur-md border border-white/10 transition-colors hover:bg-white/20 ${
                  isFavorite(product.id) ? 'bg-accent/80 text-accent-foreground' : 'bg-black/40 text-white'
                }`}
                title="Add to Favorites"
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`}
                />
              </button>
            )}
          </div>

          {/* Details Label */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {(product.era && product.era !== 'None') ? `${product.era} · ` : ''}{product.archiveType}
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-xl tracking-wide hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="detail-label">{product.dropName}</span>
          <span className="text-sm tracking-wide">Rs. {product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
