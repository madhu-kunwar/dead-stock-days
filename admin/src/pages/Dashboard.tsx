import { useQuery } from '@tanstack/react-query'
import { 
  Package, 
  Clock, 
  ShieldCheck, 
  Activity,
  LogOut,
  TrendingUp
} from 'lucide-react'
import { productApi } from '../lib/api'

export function Dashboard() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  })

  const availableProducts = products.filter(p => !p.soldOut).length
  const soldOutProducts = products.filter(p => p.soldOut).length
  const totalValue = products.reduce((sum, p) => sum + p.price, 0)

  const stats = [
    {
      label: 'Products in Store',
      value: products.length,
      icon: Package,
      description: 'Total items in your list'
    },
    {
      label: 'Currently Available',
      value: availableProducts,
      icon: Activity,
      description: 'Ready for customers',
      color: 'text-accent'
    },
    {
      label: 'Sold Out Pieces',
      value: soldOutProducts,
      icon: Clock,
      description: 'Waiting for restock/similar items',
      color: 'text-destructive'
    },
    {
      label: 'Total Value',
      value: `Rs. ${totalValue.toLocaleString()}`,
      icon: TrendingUp,
      description: 'Total worth of all products'
    }
  ]

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-12 px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-border gap-6">
          <div>
            <span className="detail-label">Admin Panel</span>
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl">Overview</h1>
            <p className="text-muted-foreground mt-4 max-w-md">
              Manage your products and track your stock details.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 border border-border">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-[10px] tracking-widest uppercase">System Online</span>
            </div>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors uppercase text-[10px] tracking-widest group">
              <LogOut className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div 
              key={stat.label} 
              className="bg-card border border-border p-8 hover:border-accent/40 transition-colors group animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <stat.icon className="w-6 h-6 text-muted-foreground" />
                <span className="text-[10px] tracking-tight text-muted-foreground/40 uppercase">Stat #{i+1}</span>
              </div>
              <p className="detail-label mb-2">{stat.label}</p>
              <h3 className={`hero-title text-4xl mb-4 ${stat.color || ''}`}>{isLoading ? '...' : stat.value}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recent Activity (Placeholders) */}
          <div className="bg-muted/10 border border-border p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <h2 className="hero-title text-2xl uppercase tracking-wider">Recent Changes</h2>
              </div>
              
              <div className="space-y-8">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-6 pb-6 border-b border-border/50 last:border-0 opacity-60">
                    <div className="w-1 bg-accent/20" />
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Stock Update • 2h ago</p>
                      <h4 className="font-display tracking-wide uppercase text-sm">Product information saved successfully.</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="detail-label hover:text-foreground transition-colors mt-8 inline-flex items-center gap-2">
              VIEW SYSTEM LOGS →
            </button>
          </div>

          <div className="space-y-8">
             <div className="bg-accent text-white p-10 flex flex-col justify-between min-h-[240px]">
                <h2 className="hero-title text-3xl">Manage<br/>Collection</h2>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="bg-white text-black px-6 py-3 font-display uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors w-fit"
                >
                  View All Products
                </button>
             </div>
             
             <div className="bg-card border border-border p-10 flex flex-col justify-between min-h-[240px]">
                <h2 className="hero-title text-3xl">Ready for<br/>New Drop?</h2>
                <button 
                  onClick={() => window.location.href = '/products/new'}
                  className="btn-request w-fit"
                >
                  Add New Product
                </button>
             </div>
          </div>
        </div>
      </div>
    </main>
  )
}
