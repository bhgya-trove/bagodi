import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  MapPin,
  User,
  ShoppingBag,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { formatINR } from '../../utils/formatCurrency';
import { generateOrderId, generateTrackingNumber } from '../../utils/idGenerator';
import { Order, PaymentMethod } from '../../types/order';
import { toast } from '../../store/useToastStore';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    appliedCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryCharge,
    getTotal,
    clearCart,
  } = useCartStore();

  const { user, addAddress } = useAuthStore();
  const { placeOrder } = useOrderStore();

  // Multi-step state:
  // 1 = Customer Details, 2 = Delivery Address, 3 = Order Summary, 4 = Payment & Place Order
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states: prefilled from logged-in user if available, fully editable
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const defaultAddr = user?.addresses?.[0];
  const [houseNo, setHouseNo] = useState(defaultAddr?.houseNo || '');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [city, setCity] = useState(defaultAddr?.city || 'Bidar');
  const [state, setState] = useState(defaultAddr?.state || 'Karnataka');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '585401');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Payment states: Default to 'cod' (Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = getDeliveryCharge();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-charcoal-900">
          Your shopping bag is empty
        </h2>
        <p className="text-xs text-charcoal-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="btn-gold inline-block text-xs py-2.5 px-6 rounded font-bold uppercase tracking-wider"
        >
          Browse Catalogue
        </Link>
      </div>
    );
  }

  // Validations
  const validateStep1 = () => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone.endsWith(cleanPhone.slice(-10)) || !phoneRegex.test(cleanPhone.slice(-10))) {
      toast.error('Please enter a valid 10-digit Indian mobile number (e.g. 9845012345).');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!houseNo.trim()) {
      toast.error('Please enter house / flat / building details.');
      return false;
    }
    if (!street.trim()) {
      toast.error('Please enter street or locality.');
      return false;
    }
    if (!city.trim()) {
      toast.error('Please enter city.');
      return false;
    }
    if (!state.trim()) {
      toast.error('Please enter state.');
      return false;
    }
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(pincode.trim())) {
      toast.error('Please enter a valid 6-digit Indian PIN code (e.g. 585401).');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      // Save address to user profile if checked and user is logged in
      if (user && saveAddressToProfile) {
        const updatedAddress = {
          fullName,
          phone,
          email,
          houseNo,
          street,
          city,
          state,
          pincode,
          isDefault: true,
        };
        const existingAddresses = user.addresses || [];
        const isAlreadySaved = existingAddresses.some(
          (a) => a.houseNo === houseNo && a.pincode === pincode
        );
        if (!isAlreadySaved) {
          addAddress(updatedAddress);
        }
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod !== 'cod') {
      toast.error('Online payment gateway integration is required. Please choose Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);

    const orderId = generateOrderId();
    const trackingNum = generateTrackingNumber();

    const deliveryEstimateDate = new Date();
    deliveryEstimateDate.setDate(
      deliveryEstimateDate.getDate() + (city.toLowerCase().trim() === 'bidar' ? 1 : 3)
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderId,
      date: new Date().toISOString(),
      customer: {
        fullName,
        phone,
        email,
        houseNo,
        street,
        city,
        state,
        pincode,
      },
      items: [...items],
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      deliveryCharge,
      total,
      paymentMethod: 'cod',
      paymentStatus: 'Cash on Delivery',
      orderStatus: 'Confirmed',
      trackingNumber: trackingNum,
      deliveryDateEstimate: deliveryEstimateDate.toISOString().split('T')[0],
    };

    setTimeout(() => {
      placeOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      navigate(`/order-success?orderId=${newOrder.orderNumber}`);
    }, 700);
  };

  const stepLabels = [
    { num: 1, label: 'Customer' },
    { num: 2, label: 'Address' },
    { num: 3, label: 'Review' },
    { num: 4, label: 'Payment' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      {/* Checkout Steps Progress Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-charcoal-200 -z-0" />

          {stepLabels.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;

            return (
              <div key={st.num} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (st.num < currentStep) {
                      setCurrentStep(st.num);
                    }
                  }}
                  disabled={st.num > currentStep}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    isCurrent
                      ? 'bg-charcoal text-white ring-4 ring-gold/25'
                      : isCompleted
                      ? 'bg-charcoal text-gold cursor-pointer'
                      : 'bg-white border-2 border-charcoal-200 text-charcoal-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-gold" /> : st.num}
                </button>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider mt-1.5 ${
                    isCurrent
                      ? 'text-charcoal-900 font-bold'
                      : isCompleted
                      ? 'text-charcoal-700'
                      : 'text-charcoal-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: CUSTOMER DETAILS */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-charcoal-100 p-6 sm:p-8 shadow-subtle space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 pb-4 border-b border-charcoal-100">
                <User className="w-5 h-5 text-gold" />
                <h2 className="font-serif font-bold text-xl text-charcoal-900">
                  Step 1: Customer Details
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold font-sans"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      Mobile Number (10 digits) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-charcoal-400 font-medium">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9845012345"
                        className="w-full pl-12 pr-3 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      Email Address (Invoice & Tracking) *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-warmWhite rounded-lg text-charcoal-600 text-[11px] leading-relaxed border border-charcoal-200">
                  Your contact details will be used solely for order status updates, dispatch notifications, and your electronic GST receipt.
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-gold flex items-center gap-2 text-xs uppercase tracking-wider font-bold py-3 px-8 rounded shadow-premium"
                >
                  <span>Continue to Delivery Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY ADDRESS */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl border border-charcoal-100 p-6 sm:p-8 shadow-subtle space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  <h2 className="font-serif font-bold text-xl text-charcoal-900">
                    Step 2: Delivery Address
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    House / Flat / Building No. *
                  </label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="e.g. Flat 302, Green Avenue / House #48"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Street / Colony / Landmark *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Near Shivaji Chowk, Main Market Road"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bidar"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                      PIN Code (6 digits) *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="585401"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Save address option */}
                {user && (
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-700">
                      <input
                        type="checkbox"
                        checked={saveAddressToProfile}
                        onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                        className="rounded text-gold focus:ring-gold"
                      />
                      <span>Save this shipping address to my BAGODI account profile</span>
                    </label>
                  </div>
                )}

                <div className="p-3 bg-warmWhite rounded-lg border border-gold/30 text-charcoal-800 text-[11px] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold shrink-0" />
                  <span>
                    Deliveries in <strong>Bidar (585401)</strong> qualify for <strong>Same-Day Dispatch & Delivery</strong> by BAGODI Mall local delivery team.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-outline-charcoal text-xs py-2.5 px-6 rounded uppercase tracking-wider"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-gold flex items-center gap-2 text-xs uppercase tracking-wider font-bold py-3 px-8 rounded shadow-premium"
                >
                  <span>Review Order Items</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER SUMMARY REVIEW */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl border border-charcoal-100 p-6 sm:p-8 shadow-subtle space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <h2 className="font-serif font-bold text-xl text-charcoal-900">
                    Step 3: Review Order Items ({items.length})
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-charcoal-100">
                {items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-18 rounded object-cover border border-charcoal-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-charcoal-900 text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-charcoal-500 mt-1">
                          <span className="bg-warmWhite px-2 py-0.5 rounded border border-charcoal-200">
                            Size: <strong className="text-charcoal-800">{item.selectedSize}</strong>
                          </span>
                          <span className="bg-warmWhite px-2 py-0.5 rounded border border-charcoal-200 flex items-center gap-1">
                            Colour:
                            <span
                              className="w-2 h-2 rounded-full border border-charcoal-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <strong className="text-charcoal-800">{item.selectedColor.name}</strong>
                          </span>
                          <span className="bg-warmWhite px-2 py-0.5 rounded border border-charcoal-200">
                            Qty: <strong className="text-charcoal-800">{item.quantity}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] text-charcoal-400 font-mono block mt-1">
                          SKU: {item.sku}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-bold text-charcoal-900 text-sm shrink-0">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Details Snapshot */}
              <div className="bg-warmWhite p-4 rounded-lg border border-charcoal-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
                  Delivery Destination
                </span>
                <p className="font-bold text-charcoal-900">{fullName} ({phone})</p>
                <p className="text-charcoal-700">{houseNo}, {street}, {city}, {state} - {pincode}</p>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-outline-charcoal text-xs py-2.5 px-6 rounded uppercase tracking-wider"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-gold flex items-center gap-2 text-xs uppercase tracking-wider font-bold py-3 px-8 rounded shadow-premium"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT METHOD & PLACE ORDER */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl border border-charcoal-100 p-6 sm:p-8 shadow-subtle space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gold" />
                  <h2 className="font-serif font-bold text-xl text-charcoal-900">
                    Step 4: Select Payment Method
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-charcoal-500 hover:text-charcoal-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. Cash on Delivery (Enabled) */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-gold bg-gold-light/20 shadow-xs'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-gold focus:ring-gold"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                        <Banknote className="w-4.5 h-4.5 text-gold" />
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Available in Bidar
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      Pay with cash or UPI on delivery when our courier executive reaches your doorstep. No advance payment required.
                    </p>
                  </div>
                </label>

                {/* 2. Online Payment (UPI / QR) - Gateway Required Warning */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'upi'
                      ? 'border-amber-400 bg-amber-50/50'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                        <QrCode className="w-4.5 h-4.5 text-charcoal-700" />
                        UPI Instant Online Payment
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                        Gateway Integration Required
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500">
                      Direct UPI Intent, QR Code & Google Pay / PhonePe checkout.
                    </p>

                    {paymentMethod === 'upi' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 mt-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Online Gateway Integration Required</p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            Online payment gateway (Razorpay / PayU / Cashfree) is not yet connected to the store. In accordance with genuine data integrity rules, simulated online payments are not performed. Please select <strong>Cash on Delivery (COD)</strong> to place your real order.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Cards & Netbanking - Gateway Required Warning */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-50/50'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                        <CreditCard className="w-4.5 h-4.5 text-charcoal-700" />
                        Credit / Debit Card / Netbanking
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                        Gateway Integration Required
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500">
                      Visa, Mastercard, RuPay & Indian Netbanking.
                    </p>

                    {paymentMethod === 'card' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 mt-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Payment Gateway Integration Required</p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            Card gateway integration is not configured. Please switch to <strong>Cash on Delivery (COD)</strong> to confirm your purchase.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Order Placement CTA */}
              <div className="pt-4 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-outline-charcoal text-xs py-2.5 px-6 rounded uppercase tracking-wider w-full sm:w-auto"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || paymentMethod !== 'cod'}
                  className={`flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold py-3.5 px-10 rounded shadow-premium transition w-full sm:w-auto ${
                    paymentMethod === 'cod' && !isSubmitting
                      ? 'btn-gold'
                      : 'bg-charcoal-200 text-charcoal-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : paymentMethod === 'cod' ? (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <span>Select COD to Place Order</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-6 sticky top-24">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-3 border-b border-charcoal-100">
              Bill Summary
            </h3>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs text-charcoal-700">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-gold font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="font-semibold text-charcoal-900">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-charcoal-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-charcoal-900 block">Total Amount</span>
                  <span className="text-[10px] text-charcoal-400">Inclusive of all GST taxes</span>
                </div>
                <span className="text-xl font-bold text-charcoal-950 font-serif">
                  {formatINR(total)}
                </span>
              </div>
            </div>

            {/* Assurance Badges */}
            <div className="pt-4 border-t border-charcoal-100 space-y-2.5 text-xs text-charcoal-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>100% Genuine Clothing from BAGODI Mall, Bidar</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold shrink-0" />
                <span>Local express delivery to your doorstep</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Instant confirmation & tracking waybill</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};