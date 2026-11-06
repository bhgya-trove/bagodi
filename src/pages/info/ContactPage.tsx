import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { toast } from '../../store/useToastStore';

export const ContactPage: React.FC = () => {
  const { settings } = useAdminStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product / Size Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Your message has been received by our Bidar store team!');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-charcoal-900">
          Visit Us or Reach Out
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 font-sans">
          Assistance with orders, size guidance, or store consultations at BAGODI Shopping Mall, Bidar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Store Details & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-charcoal-100 p-6 sm:p-8 shadow-subtle space-y-6">
            <h3 className="font-serif font-bold text-xl text-charcoal-900 pb-3 border-b border-charcoal-100">
              BAGODI Shopping Mall
            </h3>

            <div className="space-y-4 text-xs font-sans text-charcoal-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-charcoal-900 text-sm mb-0.5">
                    Flagship Store Address
                  </strong>
                  <p>{settings.addressLine1}</p>
                  <p>{settings.addressLine2}</p>
                  <p>{settings.city}, {settings.state} - <strong>{settings.pincode}</strong></p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-charcoal-900 text-sm mb-0.5">
                    Mall Operating Hours
                  </strong>
                  <p>Monday – Sunday: 10:00 AM – 9:30 PM</p>
                  <p className="text-charcoal-900 font-medium">Open All 365 Days Including Public Holidays</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-charcoal-900 text-sm mb-0.5">
                    Telephone Assistance
                  </strong>
                  <p>Store Desk: {settings.phone}</p>
                  <p>Landline: 08482 254321</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-charcoal-900 text-sm mb-0.5">
                    Email Customer Care
                  </strong>
                  <p>{settings.email}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20BAGODI%20Mall,%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-charcoal hover:bg-gold hover:text-charcoal-950 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current text-gold" />
                <span>Chat with Bidar Store Concierge</span>
              </a>
            </div>
          </div>

          {/* Map Preview Placeholder */}
          <div className="bg-charcoal-50 rounded-xl overflow-hidden border border-charcoal-200 aspect-[16/9] relative flex items-center justify-center">
            <div className="text-center p-6 space-y-2">
              <MapPin className="w-8 h-8 text-gold mx-auto" />
              <h4 className="font-serif font-bold text-sm text-charcoal-900">
                Bidar City Center (Opposite Shivaji Statue)
              </h4>
              <p className="text-[11px] text-charcoal-500 font-sans">
                Commercial Market Road, Bidar, Karnataka - 585401
              </p>
              <a
                href="https://maps.google.com/?q=Bidar+Karnataka"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-semibold text-gold hover:underline pt-1"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-charcoal-100 p-6 sm:p-10 shadow-subtle space-y-6">
            <div className="space-y-1 pb-4 border-b border-charcoal-100">
              <h3 className="font-serif font-bold text-xl text-charcoal-900">
                Send an Inquiry to Store Management
              </h3>
              <p className="text-xs text-charcoal-500 font-sans">
                Our customer relationship team in Bidar will respond within 4 business hours.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-warmWhite rounded-lg border border-gold/40 text-charcoal-900 text-xs flex items-center gap-2 font-sans">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                <span>Thank you! Your message has been sent to BAGODI Mall support.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="Product / Size Inquiry">Product / Size Availability</option>
                    <option value="Consultation">Bridal / Wedding Suite Booking</option>
                    <option value="Online Order Tracking">Online Order Delivery Status</option>
                    <option value="Store Tailoring">In-Store Tailoring Service</option>
                    <option value="General Feedback">General Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Message *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you are looking for..."
                  required
                  className="w-full p-3 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-gold flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded shadow-premium"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
