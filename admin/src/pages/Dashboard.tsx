import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Archive, ChevronRight, Activity, Database, Layers } from 'lucide-react'
import { productApi, type Product } from '../lib/api'

export function Dashboard() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  })

  const totalProducts = products.length
  const inStock = products.filter((p: Product) => !p.soldOut).length
  const soldOut = products.filter((p: Product) => p.soldOut).length
  const totalValue = products.reduce((acc: number, p: Product) => acc + p.price * p.quantity, 0)

  const stats = [
    { label: 'ARCHIVE ENTRIES', value: totalProducts, icon: Database },
    { label: 'ACTIVE COLLECTION', value: inStock, icon: Layers },
    { label: 'LIQUIDATED UNITS', value: soldOut, icon: Archive },
    { label: 'VALUATION (RS.)', value: `Rs. ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Activity },
  ]

  return (
    <div className="py-12 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-border gap-6">
        <div>
          <span className="archive-label">Control Interface</span>
          <h1 className="hero-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl">DASHBOARD</h1>
          <p className="text-muted-foreground mt-4 uppercase tracking-[0.2em] text-sm">
            Operational overview of the Deadstock archival system.
          </p>
        </div>
        <Link to="/products/new" className="btn-request w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          REGISTRY ENTRY
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mb-16">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-background p-10 space-y-6 group hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-accent" />
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity uppercase font-medium">REAL-TIME SYNC</span>
              </div>
              <div>
                <p className="hero-title text-4xl lg:text-5xl">
                   {isLoading ? '—' : stat.value}
                </p>
                <p className="archive-label mt-2">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Archive Updates */}
        <div className="bg-card border border-border p-10">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-border">
            <h2 className="hero-title text-3xl">RECENT UPDATES</h2>
            <Link to="/products" className="archive-label hover:text-foreground transition-colors flex items-center gap-1 group">
              FULL ARCHIVE <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-16 bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-6">
              {products.slice(0, 5).map((p: Product) => (
                <Link key={p.id} to={`/products/${p.id}/edit`} className="group flex items-center gap-6 p-4 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="w-16 h-16 bg-muted overflow-hidden border border-border">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Archive className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium uppercase tracking-widest">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-tighter">ERA: {p.era} | Rs. {p.price}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-card border border-border p-10 flex flex-col">
          <h2 className="hero-title text-3xl mb-10 pb-4 border-b border-border text-left">ARCHIVE INTEGRITY</h2>
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 py-10">
             <div className="relative">
                <div className="w-32 h-32 rounded-full border border-accent/20 flex items-center justify-center animate-pulse">
                   <div className="w-24 h-24 rounded-full border border-accent/40 flex items-center justify-center animate-spin duration-10000">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                         <Activity className="h-6 w-6 text-accent" />
                      </div>
                   </div>
                </div>
             </div>
             <div>
                <p className="hero-title text-2xl">Ledger Synchronized</p>
                <p className="archive-label mt-2">All assets currently indexed</p>
             </div>
             <div className="grid grid-cols-2 w-full gap-px bg-border mt-auto pt-10">
                <div className="bg-card p-6 text-left">
                   <p className="archive-label">SECURE UPLOAD</p>
                   <p className="text-xs mt-2 text-muted-foreground">CLOUDINARY V2 ACTIVE</p>
                </div>
                <div className="bg-card p-6 text-left">
                   <p className="archive-label">API LATENCY</p>
                   <p className="text-xs mt-2 text-muted-foreground">OPTIMIZED RESPONSE</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
