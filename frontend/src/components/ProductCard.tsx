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
              <span className="sold-out-badge">Sold Out</span>
            ) : (
              <span className="quantity-badge">Only {product.quantity} Left</span>
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
          
          <div className="flex items-center gap-2">
            {product.soldOut ? (
              <button
                onClick={() => toggleBucketlist(product.id)}
                className="p-1.5 transition-colors hover:text-accent"
                title="Add to Wishlist"
              >
                <BookmarkPlus 
                  className={`w-4 h-4 ${
                    isInBucketlist(product.id) 
                      ? 'fill-accent text-accent' 
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ) : (
              <button
                onClick={() => toggleFavorite(product.id)}
                className="p-1.5 transition-colors hover:text-accent"
                title="Add to Favorites"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    isFavorite(product.id) 
                      ? 'fill-accent text-accent' 
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            )}
          </div>
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
