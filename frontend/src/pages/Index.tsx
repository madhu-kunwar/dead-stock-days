import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import heroImage from '@/assets/hero-image.jpg';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import EmailCapture from '@/components/EmailCapture';

const Index = () => {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const featuredProducts = products 
    ? products.filter(p => !p.soldOut).slice(0, 3)
    : [];

  const liveDrop = {
    name: 'Archive 002',
    description: 'A curated collection of vintage military and workwear essentials from the late 90s and early 2000s.'
  };

  const featuredDropImage = heroImage;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Dead Stock Days"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-20">
          <div className="max-w-4xl animate-fade-in">
            <span className="hero-subtitle text-muted-foreground mb-6 block">
              Archive Streetwear
            </span>
            <h1 className="hero-title mb-8">
              Dead<br />Stock<br />Days
            </h1>
            <p className="text-xl md:text-2xl font-light text-foreground/80 max-w-xl mb-10 leading-relaxed animate-fade-in-delay-1">
              Extremely limited. 2–3 pieces per item. No restocks. Ever.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
              <Link to="/drops" className="btn-request">
                Enter Archive
              </Link>
              <Link to="/about" className="btn-outline">
                Our Philosophy
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-foreground/30 to-foreground/60" />
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-32 border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="archive-label">The Manifesto</span>
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-display tracking-wide leading-tight">
              "We don't chase trends. We preserve history. Every piece in our archive 
              is a fragment of fashion's past—rescued, curated, and offered to the few 
              who understand that true style is earned, not bought."
            </blockquote>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dead Stock Days exists for those who reject the ordinary. We source rare, 
              unworn archive pieces and vintage garments that tell stories. When they're 
              gone, they're gone.
            </p>
          </div>
        </div>
      </section>

      {/* Current Drop */}
      <section className="py-24 border-t border-border">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="metadata block mb-2">Current Drop</span>
                <h2 className="display-medium">{liveDrop.name}</h2>
              </div>
              <Link 
                to="/drops" 
                className="cta-ghost flex items-center gap-2 group"
              >
                View All
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] mb-12 overflow-hidden bg-muted">
              <img 
                src={featuredDropImage} 
                alt={liveDrop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="body-large text-foreground max-w-xl">
                  {liveDrop.description}
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Exclusivity Banner */}
      <section className="py-24 bg-muted border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-3">
              <span className="font-display text-5xl md:text-6xl">2-3</span>
              <p className="archive-label">Pieces Per Item</p>
            </div>
            <div className="space-y-3">
              <span className="font-display text-5xl md:text-6xl">0</span>
              <p className="archive-label">Restocks. Ever.</p>
            </div>
            <div className="space-y-3">
              <span className="font-display text-5xl md:text-6xl">∞</span>
              <p className="archive-label">Authenticity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <EmailCapture />
    </main>
  );
};

export default Index;
