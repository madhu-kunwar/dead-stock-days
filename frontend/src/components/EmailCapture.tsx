import { useState } from 'react';
import { toast } from 'sonner';
import { Instagram, MessageCircle } from 'lucide-react';

const EmailCapture = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success('Welcome to the archive. You\'ll hear from us soon.');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <span className="detail-label">Stay Informed</span>
            <h2 className="section-title">First Access</h2>
            <p className="text-muted-foreground leading-relaxed">
              Be the first to know when new exclusive pieces drop. 
              No spam, just rare finds.
            </p>
          </div>

          {/* 
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-editorial flex-1 lg:text-center"
              required
            />
            <button 
              type="submit" 
              className="btn-request whitespace-nowrap px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Subscribe'}
            </button>
          </form> 
          */}

          <div className="space-y-4">
             <p className="text-muted-foreground leading-relaxed">
               For inquiries and archive access, connect with us directly.
             </p>
          </div>

          {/* Social Links */}
          <div className="pt-8 border-t border-border/50 max-w-xs mx-auto">
             <span className="text-[10px] detail-label opacity-40 uppercase tracking-[0.3em] block mb-6">Direct Channels</span>
             <div className="flex justify-center items-center gap-12">
                <a 
                  href="https://www.instagram.com/dead_stock_days/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center gap-2 hover:text-accent transition-all duration-300"
                >
                  <Instagram className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Instagram</span>
                </a>
                <a 
                  href="https://wa.me/9708366579" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center gap-2 hover:text-accent transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  <span className="text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
                </a>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;
