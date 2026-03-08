import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useBucketlist } from '@/hooks/useBucketlist';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { bucketlist } = useBucketlist();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const bucketlistProducts = products.filter(p => bucketlist.includes(p.id));

  return (
    <main className="pt-20 min-h-screen">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <span className="detail-label">Your Collection</span>
            <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl">Saved</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Your curated selection of exclusive pieces. Items saved for later and 
              sold-out pieces you're watching.
            </p>
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-2 mb-12">
            <span className="detail-label">Available</span>
            <h2 className="section-title">Favorites</h2>
          </div>

          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {favoriteProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No favorites yet.</p>
              <Link to="/drops" className="nav-link">
                Browse Collection →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Wishlist Section */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-2 mb-12">
            <span className="detail-label">Sold Out</span>
            <h2 className="section-title">Wishlist</h2>
            <p className="text-muted-foreground max-w-lg">
              Sold-out pieces you're watching. We'll notify you if similar items become available.
            </p>
          </div>

          {bucketlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {bucketlistProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No wishlist items yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Favorites;
