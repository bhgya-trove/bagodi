import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 font-sans">
      <div className="space-y-2">
        <span className="font-serif text-7xl font-bold text-gold tracking-tight block">
          404
        </span>
        <h1 className="text-2xl font-serif font-bold text-charcoal-900">
          Page Not Found
        </h1>
        <p className="text-xs text-charcoal-500 font-sans leading-relaxed">
          The page you requested may have been relocated or is no longer available. 
          Please return to BAGODI Shopping Mall or explore our fashion catalogue.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2 font-sans">
        <Link
          to="/home"
          className="btn-gold flex items-center gap-2 text-xs py-3 px-6 rounded uppercase tracking-wider font-bold shadow-premium"
        >
          <Home className="w-4 h-4" />
          <span>Store Home</span>
        </Link>
        <Link
          to="/shop"
          className="btn-outline-charcoal flex items-center gap-2 text-xs py-3 px-6 rounded uppercase tracking-wider font-bold"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Catalogue</span>
        </Link>
      </div>
    </div>
  );
};
