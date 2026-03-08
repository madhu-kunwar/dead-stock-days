import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings, 
  Users,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Database
} from 'lucide-react'
import { cn } from '../lib/utils'

interface SidebarItemProps {
  to: string
  icon: any
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarItem({ to, icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-6 py-4 border-l-2 transition-all duration-300 group",
        active 
          ? "bg-muted border-accent text-foreground" 
          : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active && "text-accent")} />
      <span className="font-display tracking-[0.2em] uppercase text-[10px] sm:text-xs">
        {label}
      </span>
      {active && <ChevronRight className="w-3 h-3 ml-auto text-accent animate-in fade-in slide-in-from-left-2" />}
    </Link>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      <div className="p-8 border-b border-border mb-8">
        <Link to="/" className="flex flex-col gap-1 items-start group">
          <span className="text-[10px] tracking-[0.3em] font-light text-muted-foreground uppercase group-hover:text-accent transition-colors">Dead Stock Days</span>
          <span className="hero-title text-3xl tracking-tight leading-none group-hover:text-foreground transition-colors">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem 
          to="/" 
          icon={LayoutDashboard} 
          label="Home / Dashboard" 
          active={location.pathname === '/'} 
          onClick={() => setSidebarOpen(false)}
        />
        <SidebarItem 
          to="/products" 
          icon={Package} 
          label="All Products" 
          active={location.pathname === '/products'} 
          onClick={() => setSidebarOpen(false)}
        />
        <SidebarItem 
          to="/products/new" 
          icon={PlusCircle} 
          label="Add New Item" 
          active={location.pathname === '/products/new'} 
          onClick={() => setSidebarOpen(false)}
        />
      </nav>

      <div className="p-8 border-t border-border mt-auto space-y-6">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="relative">
            <Database className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase">Database Connected</span>
        </div>
        
        <button className="flex items-center gap-3 w-full p-2 text-muted-foreground hover:text-destructive transition-colors uppercase text-[10px] tracking-widest group">
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Disconnect
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-transform duration-500 ease-editorial",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative w-80 h-full">
            <SidebarContent />
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 -right-12 p-2 text-white"
            >
              <X className="h-6 w-6" />
            </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-80 hidden lg:block border-r border-border">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-80 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 border-b border-border bg-card">
          <Link to="/" className="hero-title text-xl">Deadstock Admin</Link>
          <button onClick={() => setSidebarOpen(true)} className="p-2 border border-border">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 animate-in fade-in duration-700">
          {children}
        </div>

        {/* Global Status Bar */}
        <footer className="border-t border-border p-4 bg-muted/20">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-[8px] tracking-[0.3em] uppercase opacity-30">Admin Panel v1.0</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                 <span className="text-[8px] tracking-[0.2em] uppercase text-muted-foreground">Server Running</span>
              </div>
            </div>
            <span className="text-[8px] tracking-[0.2em] uppercase text-muted-foreground">© 2024 Dead Stock Days</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
