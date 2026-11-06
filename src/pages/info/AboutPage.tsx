import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  MapPin,
  Clock,
  Heart,
  Users,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Editorial Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-charcoal text-white p-8 sm:p-16 lg:p-20 shadow-float">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
              alt="BAGODI Shopping Mall Heritage"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-gold/20 text-gold border border-gold/40 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase font-sans">
              Bidar Retail Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              Three Decades of Sartorial Elegance in Bidar
            </h1>
            <p className="text-xs sm:text-base text-charcoal-300 font-sans leading-relaxed">
              From our landmark physical store opposite the historic Shivaji Statue to a state-of-the-art digital storefront, 
              BAGODI Shopping Mall has been North Karnataka's premier home for distinguished fashion.
            </p>
          </div>
        </div>
      </section>

      {/* Story Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
                The BAGODI Legacy
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-charcoal-900 leading-snug">
                Rooted in Tradition, Designed for Tomorrow
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-sans">
              Founded in the historic city of Bidar, BAGODI Shopping Mall started with a singular promise: to bring metropolitan 
              refinement and genuine handloom craftsmanship together under one majestic roof. Over thirty years, generations of 
              families have chosen BAGODI for their weddings, festivals, boardroom wardrobe upgrades, and newborn celebrations.
            </p>

            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-sans">
              Every shirt fabric, silk yarn, and embroidery pattern in our catalogue is personally curated by master textile buyers. 
              We collaborate closely with traditional weavers across Karnataka, Banaras, and Kanchipuram to preserve the sacred heritage 
              of Indian textile arts.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-charcoal-100 font-sans text-center">
              <div>
                <strong className="block text-2xl font-serif font-bold text-charcoal-900">1994</strong>
                <span className="text-xs text-charcoal-500">Established in Bidar</span>
              </div>
              <div>
                <strong className="block text-2xl font-serif font-bold text-charcoal-900">50,000+</strong>
                <span className="text-xs text-charcoal-500">Delighted Families</span>
              </div>
              <div>
                <strong className="block text-2xl font-serif font-bold text-charcoal-900">100%</strong>
                <span className="text-xs text-charcoal-500">Authentic Fabrics</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-float bg-charcoal-100">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                alt="BAGODI Fashion Tailoring"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl border border-charcoal-100 shadow-float max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-gold shrink-0" />
                <p className="text-xs font-semibold text-charcoal-900">
                  Certified Master Weaves & In-Store Custom Alteration Studio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Techmasters Partnership Section */}
      <section className="bg-charcoal-50/60 py-16 border-y border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-sans">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Powered by Techmasters
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-charcoal-900">
              The Digital Commerce Evolution
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-sans">
              To bring the authentic BAGODI retail experience into every home across Karnataka and India, 
              BAGODI management partnered with <strong>Techmasters</strong> to architect a cutting-edge digital commerce platform. 
              Featuring real-time size-wise inventory synchronisation, localized express fulfillment, and responsive customer care, 
              this platform bridges the warmth of physical retail with modern digital convenience.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="btn-gold inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold py-3 px-8 rounded shadow-premium"
              >
                <span>Experience Our Digital Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-charcoal-100 p-8 sm:p-12 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-serif font-bold text-charcoal-900">
              Plan Your Visit to BAGODI Shopping Mall
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl font-sans">
              Experience the touch and drape of our textiles in person. Dedicated parking, bridal consultation suites, 
              and complimentary refreshments await you.
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-500 font-sans">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <span>Opposite Shivaji Statue, Main Market Commercial Road, Bidar, Karnataka - 585401</span>
            </div>
          </div>

          <Link
            to="/contact"
            className="btn-charcoal text-xs uppercase tracking-wider font-bold py-3.5 px-8 rounded shrink-0 shadow-premium"
          >
            Store Directions & Timings
          </Link>
        </div>
      </section>
    </div>
  );
};

