import { useState } from 'react';
import { toast } from 'sonner';

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
            <span className="archive-label">Stay Informed</span>
            <h2 className="section-title">First Access</h2>
            <p className="text-muted-foreground leading-relaxed">
              Be the first to know when new archive pieces drop. 
              No spam, just rare finds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="input-editorial flex-1"
              required
            />
            <button 
              type="submit" 
              className="btn-request whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join List'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;
