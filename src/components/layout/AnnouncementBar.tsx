import React from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { MapPin, Phone, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useAdminStore();

  if (!settings.showAnnouncement) return null;

  return (
    <div className="bg-charcoal text-white text-[11px] py-2 px-4 border-b border-charcoal-800 tracking-wide font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Location tag */}
        <div className="hidden md:flex items-center gap-1.5 text-charcoal-300">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span>Flagship Store: Shivaji Chowk, Bidar, Karnataka</span>
        </div>

        {/* Center: Special offer */}
        <div className="flex items-center gap-2 text-center text-charcoal-100 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
          <span>{settings.announcementText}</span>
        </div>

        {/* Right: Store contact */}
        <div className="hidden lg:flex items-center gap-3 text-charcoal-300">
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-1 hover:text-gold transition"
          >
            <Phone className="w-3 h-3 text-gold" />
            <span>Store Help: {settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

