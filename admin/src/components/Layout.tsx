import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, LogOut, Menu, X, Activity } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'DASHBOARD', icon: LayoutDashboard, exact: true },
  { to: '/products', label: 'ARCHIVE', icon: Package, exact: false },
]

export function Layout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/login')
  }

  const SidebarContent = () => (
    <nav className="flex flex-col h-full bg-background border-r border-border">
      {/* Brand */}
      <div className="px-8 py-10 border-b border-border">
        <h1 className="hero-title text-4xl tracking-tighter leading-none">DEADSTOCK</h1>
        <p className="archive-label mt-2 text-[10px]">Registry System v1.0</p>
      </div>

      {/* Nav */}
      <div className="flex-1 py-8 space-y-2 px-4">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3 text-xs tracking-[0.2em] font-medium transition-all duration-300 uppercase group',
                  isActive
                    ? 'text-accent border-l-2 border-accent bg-accent/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )
              }
            >
              <Icon className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              {item.label}
            </NavLink>
          )
        })}
      </div>

      {/* System Status Mockup */}
      <div className="px-8 py-6 border-t border-border opacity-30 pointer-events-none select-none">
         <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3 w-3 text-accent" />
            <span className="archive-label text-[8px]">ENCRYPTED SYNC</span>
         </div>
         <div className="h-1 bg-border w-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-accent w-1/3 animate-pulse" />
         </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-border bg-muted/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-xs tracking-[0.2em] font-medium text-muted-foreground hover:text-destructive transition-colors w-full uppercase"
        >
          <LogOut className="h-4 w-4" />
          DISCONNECT
        </button>
      </div>
    </nav>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grain-y.com/assets/images/grain.png')]" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 w-72 flex flex-col h-full animate-in slide-in-from-left duration-300">
            <SidebarContent />
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 -right-12 p-2 text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-background">
          <h1 className="hero-title text-2xl tracking-tighter">DEADSTOCK</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
