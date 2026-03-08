import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Lock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.jpg';
import { useFavorites } from '@/hooks/useFavorites';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/drops', label: 'Collection' },
    { to: '/about', label: 'Philosophy' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Dead Stock Days" className='h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-stone-200' />
            <div className='flex items-center gap-1.5 sm:gap-2'>
              <span className="font-display text-xl sm:text-2xl tracking-widest whitespace-nowrap">DEAD STOCK</span>
              <span className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground -mt-1 hidden xs:inline">DAYS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* <Link 
              to="/admin" 
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Admin Panel"
            >
              <Lock className="w-4 h-4" />
            </Link> */}
            <Link to="/favorites" className="relative group">
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  favorites.length > 0 
                    ? 'fill-accent text-accent' 
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border overflow-hidden"
            >
              <div className="flex flex-col py-8 px-6 gap-8">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      className={`nav-link text-2xl font-display tracking-widest ${isActive(link.to) ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
