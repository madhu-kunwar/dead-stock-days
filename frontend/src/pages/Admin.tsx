import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';
import { Product } from '@/types/product';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddingProduct(false);
      toast.success('Product created successfully!');
    },
    onError: () => {
      toast.error('Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Product, 'id'>> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      updateProduct(id, { featured }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(variables.featured ? 'Added to Featured' : 'Removed from Featured');
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <main className="pt-20 min-h-screen">
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <div className="text-center">
            <h1 className="font-display text-4xl mb-4 text-muted-foreground animate-pulse">
              Loading Admin Panel...
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-border">
          <div>
            <span className="detail-label">Management</span>
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl">Admin</h1>
            <p className="text-muted-foreground mt-4">
              Manage your products and collections.
            </p>
          </div>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="btn-request"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-muted p-6 border border-border">
            <span className="detail-label">Total Items</span>
            <p className="font-display text-4xl mt-2">{products.length}</p>
          </div>
          <div className="bg-muted p-6 border border-border">
            <span className="detail-label">In Stock</span>
            <p className="font-display text-4xl mt-2 text-accent">
              {products.filter(p => !p.soldOut).length}
            </p>
          </div>
          <div className="bg-muted p-6 border border-border">
            <span className="detail-label">Sold Out</span>
            <p className="font-display text-4xl mt-2 text-destructive">
              {products.filter(p => p.soldOut).length}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left detail-label">Image</th>
                  <th className="px-6 py-4 text-left detail-label">Name</th>
                  <th className="px-6 py-4 text-left detail-label">Price</th>
                  <th className="px-6 py-4 text-left detail-label">Era</th>
                  <th className="px-6 py-4 text-left detail-label">Category</th>
                  <th className="px-6 py-4 text-left detail-label">Stock</th>
                  <th className="px-6 py-4 text-left detail-label">Featured</th>
                  <th className="px-6 py-4 text-left detail-label">Status</th>
                  <th className="px-6 py-4 text-left detail-label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm">Rs. {product.price}</td>
                    <td className="px-6 py-4 text-sm">{product.era}</td>
                    <td className="px-6 py-4 text-sm">{product.productCategory || product.archiveType}</td>
                    <td className="px-6 py-4 text-sm">{product.quantity}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeaturedMutation.mutate({ id: product.id, featured: !product.featured })}
                        className={`p-2 transition-colors ${product.featured ? 'text-accent' : 'text-muted-foreground/30 hover:text-accent/50'}`}
                      >
                        <Star className={`w-4 h-4 ${product.featured ? 'fill-accent' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {product.soldOut ? (
                        <span className="sold-out-badge text-[10px]">Sold Out</span>
                      ) : (
                        <span className="quantity-badge text-[10px]">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 hover:bg-accent/10 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {(isAddingProduct || editingProduct) && (
          <ProductFormModal
            product={editingProduct}
            onClose={() => {
              setIsAddingProduct(false);
              setEditingProduct(null);
            }}
            onSubmit={(data) => {
              if (editingProduct) {
                updateMutation.mutate({ id: editingProduct.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
          />
        )}
      </div>
    </main>
  );
};

// Product Form Modal Component
const ProductFormModal = ({
  product,
  onClose,
  onSubmit,
}: {
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    price: product?.price || 0,
    era: product?.era || 'None',
    archiveType: product?.archiveType || 'Tops',
    productCategory: product?.productCategory || 'T-Shirts',
    shoppingCategory: product?.shoppingCategory || 'New Arrivals',
    size: product?.size || '',
    color: product?.color || '',
    brand: product?.brand || '',
    material: product?.material || '',
    style: product?.style || 'Streetwear',
    description: product?.description || '',
    function: product?.function || '',
    quantity: product?.quantity || 0,
    featured: product?.featured || false,
    soldOut: product?.soldOut || false,
    image: product?.image || '',
    images: product?.images || [],
    dropDate: product?.dropDate || new Date().toISOString().split('T')[0],
    dropName: product?.dropName || 'Drop 001',
  });

  const PRODUCT_CATEGORIES = [
    'T-Shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Coats', 
    'Jeans', 'Pants / Trousers', 'Shorts', 'Activewear', 'Tank tops', 'Crop tops', 'Cardigan', 'Formal Wear', 'Accessories'
  ];
  const SHOPPING_CATEGORIES = [
    'Featured', 'New Arrivals', 'Best Sellers', 'Trending', 'Sale / Discount', 
    'Summer', 'Winter', 'Limited Edition'
  ];
  const STYLE_OPTIONS = ['Streetwear', 'Formal', 'Casual', 'Outerwear', 'Sporty', 'Baggy'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-card border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-2xl tracking-wide uppercase">
            {product ? 'Edit Item' : 'New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="detail-label">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-editorial w-full"
                placeholder="Product Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="detail-label">Price (Rs.)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="input-editorial w-full"
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="detail-label">Vintage Era</label>
              <select
                value={formData.era}
                onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                className="input-editorial w-full"
                required
              >
                <option value="None">None</option>
                <option value="80s">80s</option>
                <option value="90s">90s</option>
                <option value="2000s">2000s</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="detail-label">Product Category</label>
              <select
                value={formData.productCategory}
                onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                className="input-editorial w-full"
                required
              >
                {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="detail-label">Shop Section</label>
              <select
                value={formData.shoppingCategory}
                onChange={(e) => setFormData({ ...formData, shoppingCategory: e.target.value })}
                className="input-editorial w-full"
                required
              >
                {SHOPPING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="detail-label">Style</label>
              <select
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="input-editorial w-full"
                required
              >
                {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="detail-label">Available Sizes</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="input-editorial w-full"
                placeholder="S, M, L"
              />
            </div>

            <div className="space-y-2">
              <label className="detail-label">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="input-editorial w-full"
                placeholder="Black, Navy"
              />
            </div>

            <div className="space-y-2">
              <label className="detail-label">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input-editorial w-full"
                placeholder="Brand name"
              />
            </div>

            <div className="space-y-2">
              <label className="detail-label">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="input-editorial w-full"
                placeholder="Material details"
              />
            </div>

            <div className="space-y-2">
              <label className="detail-label">Stock Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="input-editorial w-full"
                placeholder="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="detail-label">Collection Name</label>
              <input
                type="text"
                value={formData.dropName}
                onChange={(e) => setFormData({ ...formData, dropName: e.target.value })}
                className="input-editorial w-full"
                placeholder="Collection Name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="detail-label">Product Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="input-editorial w-full"
              placeholder="Image link"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="detail-label">Short Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-editorial w-full min-h-[100px] resize-none"
              placeholder="Describe the product..."
              required
            />
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
                <label htmlFor="featured" className="detail-label cursor-pointer text-xs">
                  Featured Product
                </label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="soldOut"
                checked={formData.soldOut}
                onChange={(e) => setFormData({ ...formData, soldOut: e.target.checked })}
                className="w-4 h-4 accent-accent"
              />
              <label htmlFor="soldOut" className="detail-label cursor-pointer text-xs">
                Mark as Sold Out
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button type="submit" className="btn-request flex-1 py-3 text-xs uppercase tracking-widest">
              {product ? 'Save Changes' : 'Create Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-3 text-xs uppercase tracking-widest">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
