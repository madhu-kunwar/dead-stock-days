import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-display text-3xl tracking-widest">DEAD STOCK</span>
              <span className="text-sm tracking-[0.4em] text-muted-foreground -mt-1">DAYS</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Extremely limited exclusive pieces. 2–3 per item. No restocks. Ever.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <span className="detail-label">Navigation</span>
            <div className="flex flex-col gap-3">
              <Link to="/drops" className="nav-link">Archive</Link>
              <Link to="/about" className="nav-link">Philosophy</Link>
              <Link to="/favorites" className="nav-link">Saved</Link>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <span className="detail-label">Connect</span>
            <div className="flex flex-col gap-3">
              <a 
                href="https://www.instagram.com/deadstockdays_np/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link inline-flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a 
                href="https://wa.me/9708366579" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-muted-foreground tracking-wide">
            © 2024 Dead Stock Days. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground tracking-wide">
            Curated with intention.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
