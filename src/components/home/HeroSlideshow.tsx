import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  category: string;
  collectionTitle: string;
  caption: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'men-sartorial',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=2000&q=85',
    alt: "Premium Men's Sartorial Collection at BAGODI Mall",
    category: "Men's Collection",
    collectionTitle: 'Sartorial Excellence',
    caption: 'Tailored formal suits, pure combed cotton shirts, and festive bandhgalas.',
  },
  {
    id: 'women-sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85',
    alt: 'Royal Silk Sarees & Ethnic Couture at BAGODI Mall',
    category: "Women's Collection",
    collectionTitle: 'Royal Sarees & Silks',
    caption: 'Traditional Karnataka weaves, Kanchipuram silks, and regal bridal drapes.',
  },
  {
    id: 'women-kurtis',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85',
    alt: "Women's Festive Kurtis and Contemporary Ethnic Wear at BAGODI Mall",
    category: "Women's Ethnic Wear",
    collectionTitle: 'Handcrafted Kurtas & Sets',
    caption: 'Chanderi kurtis, intricate thread embroideries, and celebratory silhouettes.',
  },
  {
    id: 'kids-fashion',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=2000&q=85',
    alt: "Kids' Festive & Casual Fashion at BAGODI Mall",
    category: "Kids' Collection",
    collectionTitle: 'Celebratory Apparel for Kids',
    caption: 'Festive ethnic kurtas, lehengas, and comfortable daily wear for boys and girls.',
  },
  {
    id: 'modern-casual',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85',
    alt: 'Modern Casuals and Everyday Luxury at BAGODI Mall',
    category: 'Everyday Luxury',
    collectionTitle: 'Modern Casuals & Linens',
    caption: 'Relaxed linen trousers, contemporary casual wear, and seasonal essentials.',
  },
];

const SLIDE_INTERVAL_MS = 5000;

export const HeroSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Preload all high-res photographs on mount to ensure seamless transitions
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Handle browser tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.visibilityState === 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Next / Previous slide actions
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Continuous auto-advance interval (5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, nextSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <section
      aria-label="BAGODI Mall Featured Collections"
      className="relative w-full overflow-hidden bg-charcoal text-white select-none border-b border-charcoal-800"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. BACKGROUND PHOTOGRAPHS WITH SMOOTH CROSSFADE & KEN BURNS ZOOM */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover object-center ${
                  isActive && !prefersReducedMotion ? 'animate-kenburns' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Multi-layered cinematic gradient overlay for perfect text legibility */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/65 to-charcoal-950/25 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-charcoal-950/80 via-transparent to-charcoal-950/30 pointer-events-none" />
      </div>

      {/* 2. FOREGROUND HERO CONTENT (CLEANLY OFFSET BELOW NAVBAR) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-between">
        {/* Top: Branding Badge & Current Showcase Tagline */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-charcoal-900/80 backdrop-blur-md border border-gold/40 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
            <span>BAGODI Shopping Mall • Bidar</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-charcoal-300 font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span>
              Now Featuring:{' '}
              <strong className="text-white font-sans uppercase tracking-wider font-semibold">
                {activeSlide.collectionTitle}
              </strong>
            </span>
          </div>
        </div>

        {/* Center: Main Editorial Typography & Action Buttons */}
        <div className="max-w-xl space-y-6 my-auto pt-6 pb-8">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm">
            STYLE THAT <br className="hidden sm:inline" />
            <span className="italic font-normal text-gold">DEFINES YOU.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-charcoal-200 font-sans max-w-lg leading-relaxed font-light">
            Discover timeless fashion for every generation at BAGODI Shopping Mall, Bidar.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/shop"
              className="btn-gold inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold py-3.5 px-8 rounded shadow-premium group transition-all duration-300"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/category/men"
                className="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal-950 text-white border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                Men
              </Link>
              <Link
                to="/category/women"
                className="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal-950 text-white border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                Women
              </Link>
              <Link
                to="/category/kids"
                className="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal-950 text-white border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                Kids
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Slide Indicators & Navigation Controls */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          {/* Slide Indicator Bars */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Show ${slide.category}`}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    isActive
                      ? 'w-8 sm:w-10 bg-gold'
                      : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  title={slide.category}
                />
              );
            })}
            <span className="text-[10px] text-charcoal-300 font-mono ml-2 hidden sm:inline">
              0{currentIndex + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous photograph"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/40 hover:bg-gold hover:text-charcoal-950 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next photograph"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-black/40 hover:bg-gold hover:text-charcoal-950 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

