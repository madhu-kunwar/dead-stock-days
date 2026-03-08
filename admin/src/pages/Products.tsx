import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, ImageIcon } from 'lucide-react'
import { productApi, type Product } from '../lib/api'

export function Products() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.dropName.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto py-12">
          <div className="text-center">
            <h1 className="hero-title text-4xl mb-4 text-muted-foreground animate-pulse">
              Loading Archive...
            </h1>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-12 px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-border gap-6 ">
          <div>
            <span className="archive-label">Collection</span>
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl">Products</h1>
            <p className="text-muted-foreground mt-4 max-w-md">
              Managing {products.length} archived pieces from the Deadstock collection.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="SEARCH ARCHIVE"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-editorial pl-6 w-full"
              />
            </div>
            <Link to="/products/new" className="btn-request w-full sm:w-auto">
              <Plus className="w-5 h-5" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-muted/30 p-8 border border-border">
            <span className="archive-label">Total Inventory</span>
            <p className="hero-title text-4xl mt-2">{products.length}</p>
          </div>
          <div className="bg-muted/30 p-8 border border-border">
            <span className="archive-label">Available Pieces</span>
            <p className="hero-title text-4xl mt-2 text-accent">
              {products.filter(p => !p.soldOut).length}
            </p>
          </div>
          <div className="bg-muted/30 p-8 border border-border">
            <span className="archive-label">Archived Out</span>
            <p className="hero-title text-4xl mt-2 text-destructive">
              {products.filter(p => p.soldOut).length}
            </p>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 mb-8 text-center uppercase tracking-widest text-sm">
            Could not synchronize with the archive. Verify backend connectivity.
          </div>
        )}

        {/* Products Table */}
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border text-left">
                <tr>
                  <th className="px-6 py-4 archive-label w-24">Visual</th>
                  <th className="px-6 py-4 archive-label">Designation</th>
                  <th className="px-6 py-4 archive-label">Valuation</th>
                  <th className="px-6 py-4 archive-label hidden md:table-cell">Era</th>
                  <th className="px-6 py-4 archive-label hidden lg:table-cell">Category</th>
                  <th className="px-6 py-4 archive-label">Quantity</th>
                  <th className="px-6 py-4 archive-label">Availability</th>
                  <th className="px-6 py-4 archive-label text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover border border-border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted flex items-center justify-center border border-border">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium tracking-wide uppercase text-sm">{product.name}</td>
                    <td className="px-6 py-4 tracking-wider text-sm">Rs. {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-muted-foreground uppercase text-xs hidden md:table-cell">{product.era}</td>
                    <td className="px-6 py-4 text-muted-foreground uppercase text-[10px] hidden lg:table-cell tracking-widest">{product.productCategory || product.archiveType}</td>
                    <td className="px-6 py-4 tracking-wider text-sm">{product.quantity}</td>
                    <td className="px-6 py-4">
                      {product.soldOut ? (
                        <span className="sold-out-badge">Sold Out</span>
                      ) : (
                        <span className="quantity-badge">Available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="p-2 hover:bg-accent/10 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
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
          {filtered.length === 0 && !isLoading && (
            <div className="py-24 text-center border-t border-border bg-muted/10">
              <p className="archive-label">The archive yields no results.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
