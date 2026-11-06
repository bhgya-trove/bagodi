import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(
    'Hello BAGODI Mall, I would like to inquire about clothing collections available at your Bidar store.'
  );
  const { settings } = useAdminStore();

  const handleSend = () => {
    const encoded = encodeURIComponent(customMsg);
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {/* Floating Concierge Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact BAGODI Mall Concierge"
        className="flex items-center gap-2 bg-charcoal text-white hover:bg-gold hover:text-charcoal-950 border border-charcoal-800 px-4 py-2.5 rounded-full shadow-premium transition-all duration-300 active:scale-95 group font-sans text-xs font-semibold tracking-wider"
      >
        <MessageCircle className="w-4 h-4 text-gold group-hover:text-charcoal-950 transition-colors" />
        <span className="hidden sm:inline">Store Concierge</span>
      </button>

      {/* Concierge Message Card */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 sm:w-88 bg-white rounded-xl shadow-float border border-charcoal-200 overflow-hidden animate-slide-up z-40">
          {/* Header in Charcoal & Gold */}
          <div className="bg-charcoal text-white p-4 flex items-center justify-between border-b border-charcoal-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-serif text-base font-bold">
                B
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide text-white">
                  BAGODI Shopping Mall
                </h4>
                <p className="text-[10px] text-charcoal-400">Bidar, Karnataka • Store Inquiries</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal-400 hover:text-white p-1 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-warmWhite text-charcoal-800 text-xs leading-relaxed space-y-3 font-sans">
            <div className="bg-white p-3 rounded-lg border border-charcoal-200">
              <p className="font-semibold text-charcoal-900 mb-1">
                Namaskara & Welcome to BAGODI
              </p>
              <p className="text-charcoal-600 text-[11px]">
                Have a question regarding sizes, styles or visiting our mall opposite Shivaji Statue in Bidar? Connect directly with our store team.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Inquiry Message:
              </label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold bg-white resize-none"
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full flex items-center justify-center gap-2 btn-gold text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition"
            >
              <Send className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
