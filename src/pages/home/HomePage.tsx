import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Phone, ChevronRight } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../../components/products/ProductCard';
import { QuickViewModal } from '../../components/common/QuickViewModal';
import { HeroSlideshow } from '../../components/home/HeroSlideshow';
import { Product } from '../../types/product';

export const HomePage: React.FC = () => {
  const { products } = useProductStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter available products by category
  const availableProducts = products.slice(0, 8);

  const categories = [
    {
      title: "Men's Clothing",
      subtitle: 'Formal Shirts, Trousers & Daily Wear',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      link: '/category/men',
    },
    {
      title: "Women's Clothing",
      subtitle: 'Kurtis, Sarees & Ethnic Ensembles',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      link: '/category/women',
    },
    {
      title: "Kids' Clothing",
      subtitle: 'Boys & Girls Garments',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
      link: '/category/kids',
    },
  ];

  return (
    <div className="w-full font-sans">
      {/* 1. CONTINUOUS ANIMATED HERO SLIDESHOW (BEGINS CLEANLY BELOW NAVBAR) */}
      <HeroSlideshow />

      {/* 2. MAIN HOMEPAGE SECTIONS WITH PROPER VERTICAL SPACING */}
      <div className="space-y-16 sm:space-y-20 py-12 sm:py-16">
        {/* Core Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 pb-2 border-b border-charcoal-200">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900">
              Shopping Departments
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Explore ready-made garments available at our Bidar mall
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                to={cat.link}
                className="group relative h-80 rounded-xl overflow-hidden border border-charcoal-200 shadow-sm flex flex-col justify-end p-6 hover:shadow-float transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

                <div className="relative z-10 space-y-1 text-white">
                  <h3 className="text-xl font-serif font-bold group-hover:text-gold transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-charcoal-300">
                    {cat.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-xs text-gold font-semibold uppercase tracking-wider">
                    <span>Browse Category</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Store Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-charcoal-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900">
                Garments in Store
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Available clothing at BAGODI Shopping Mall
              </p>
            </div>

            {availableProducts.length > 0 && (
              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-wider text-charcoal-900 hover:text-gold transition flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {availableProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-charcoal-200 p-8 sm:p-12 text-center space-y-3">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Welcome to BAGODI Shopping Mall, Bidar
              </h3>
              <p className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
                New stock arrivals are currently being catalogued by our store management. 
                Please visit our physical shopping mall opposite Shivaji Statue in Bidar or contact our store desk.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/contact"
                  className="btn-gold text-xs py-2 px-5 rounded font-bold uppercase tracking-wider"
                >
                  Store Location & Inquiries
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {availableProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Physical Store Info */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-charcoal text-white rounded-xl p-8 sm:p-10 border border-charcoal-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="text-[10px] uppercase tracking-widest text-gold font-bold block">
                Flagship Mall
              </span>
              <h3 className="text-2xl font-serif font-bold">
                Visit BAGODI Shopping Mall in Bidar
              </h3>
              <p className="text-xs text-charcoal-300 leading-relaxed">
                Explore our full range of menswear, womenswear and kids' clothing in person. Located at Shivaji Chowk, Bidar.
              </p>

              <div className="space-y-1.5 text-xs text-charcoal-300 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span>Opposite Shivaji Statue, Main Market Commercial Road, Bidar, Karnataka - 585401</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span>Operating Hours: 10:00 AM – 9:30 PM (Monday – Sunday)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span>Store Helpdesk: +91 98450 12345</span>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className="btn-gold text-xs font-bold uppercase tracking-wider py-3 px-6 rounded shrink-0 shadow-sm"
            >
              Store Directions & Contact
            </Link>
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
