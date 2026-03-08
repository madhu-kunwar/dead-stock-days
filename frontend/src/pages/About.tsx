import { Link } from 'react-router-dom';
import EmailCapture from '@/components/EmailCapture';

const About = () => {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl space-y-8">
            <span className="detail-label">Our Philosophy</span>
            <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
              Against<br />The<br />Mainstream
            </h1>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <span className="detail-label">The Manifesto</span>
              <h2 className="section-title">Why We Exist</h2>
            </div>
            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
              <p>
                In an era of infinite supply and instant gratification, Dead Stock Days 
                stands as a rebellion. We believe that true style cannot be mass-produced, 
                purchased on-demand, or restocked when convenient.
              </p>
              <p>
                Every piece in our archive has been sourced with intention—pulled from 
                forgotten warehouses, vintage dealers, and private collections around 
                the world. These are garments with histories, with stories woven into 
                every fiber.
              </p>
              <p>
                We limit each item to 2–3 pieces maximum. No exceptions. No restocks. 
                When a piece is gone, it's permanently removed from store. This isn't artificial 
                scarcity—it's the truth of authentic dead stock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-16">
            <div className="space-y-2">
              <span className="detail-label">Core Values</span>
              <h2 className="section-title">What We Believe</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <span className="font-display text-6xl text-accent">01</span>
                <h3 className="font-display text-2xl tracking-wide">Scarcity Is Truth</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real exclusivity isn't manufactured. It exists because authentic 
                  exclusive pieces are finite by nature.
                </p>
              </div>
              <div className="space-y-4">
                <span className="font-display text-6xl text-accent">02</span>
                <h3 className="font-display text-2xl tracking-wide">History Matters</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every piece has a past. We research, document, and share the 
                  stories behind what we sell.
                </p>
              </div>
              <div className="space-y-4">
                <span className="font-display text-6xl text-accent">03</span>
                <h3 className="font-display text-2xl tracking-wide">Personal Connection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No checkout buttons. Every purchase is a conversation. We want 
                  to know our customers and their style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-b border-border bg-muted">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <span className="detail-label">The Process</span>
              <h2 className="section-title">How To Acquire</h2>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <span className="font-display text-3xl text-accent shrink-0">01</span>
                <div className="space-y-2">
                  <h3 className="font-display text-xl tracking-wide">Explore Collection</h3>
                  <p className="text-muted-foreground">
                    Explore our current drop and current inventory. Each piece includes 
                    detailed descriptions, era information, and availability.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <span className="font-display text-3xl text-accent shrink-0">02</span>
                <div className="space-y-2">
                  <h3 className="font-display text-xl tracking-wide">Request Via DM</h3>
                  <p className="text-muted-foreground">
                    Found something? Reach out via WhatsApp or Instagram. We'll confirm 
                    availability and discuss details.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <span className="font-display text-3xl text-accent shrink-0">03</span>
                <div className="space-y-2">
                  <h3 className="font-display text-xl tracking-wide">Secure Your Piece</h3>
                  <p className="text-muted-foreground">
                    Once confirmed, we'll arrange payment and shipping. Your archive 
                    piece will be carefully packaged and sent with documentation.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link to="/drops" className="btn-request">
                Enter Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EmailCapture />
    </main>
  );
};

export default About;
