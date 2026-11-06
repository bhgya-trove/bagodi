import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LogOut,
  MapPin,
  Package,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { getItemCount, setCartDrawerOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Men', path: '/category/men' },
    { name: 'Women', path: '/category/women' },
    { name: 'Kids', path: '/category/kids' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSignOut = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-charcoal-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-2">
            {/* LEFT: Mobile Menu Button & Brand Identity */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-charcoal-800 hover:text-gold lg:hidden focus:outline-none transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Logo & Subtitle */}
              <Link to="/home" className="group flex flex-col items-start select-none">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.18em] text-charcoal-900 group-hover:text-gold transition-colors leading-none">
                  BAGODI
                </span>
                <span className="text-[8.5px] sm:text-[9px] font-sans font-semibold tracking-[0.26em] text-gold uppercase mt-1">
                  SHOPPING MALL · BIDAR
                </span>
              </Link>
            </div>

            {/* CENTER: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-700 font-sans">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `py-2 transition-colors relative hover:text-gold ${
                      isActive
                        ? 'text-charcoal-950 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gold'
                        : ''
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Actions (Search, Wishlist, Bag, Account / Login) */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Search Toggle Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-charcoal-700 hover:text-gold transition-colors flex items-center gap-1.5"
                aria-label="Search clothing"
                title="Search Catalogue"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="hidden xl:inline text-xs font-sans font-medium text-charcoal-600">
                  Search
                </span>
              </button>

              {/* Wishlist / Favourites Button with Live Count Badge */}
              <Link
                to="/wishlist"
                className="relative p-2 text-charcoal-700 hover:text-gold transition-colors"
                aria-label="View Wishlist"
                title="Wishlist / Favourites"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button with Live Cart Count Badge */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-charcoal-700 hover:text-gold transition-colors"
                aria-label="View Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-charcoal-900 text-gold text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account / Profile Dropdown or Sign In */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-warmWhite transition-colors text-charcoal-800 text-xs font-sans font-medium border border-transparent hover:border-charcoal-200"
                      aria-label="User Account"
                    >
                      <div className="w-7 h-7 rounded-full bg-warmWhite border border-charcoal-200 flex items-center justify-center text-charcoal-900 font-bold text-xs">
                        <User className="w-4 h-4 text-charcoal-700" />
                      </div>
                      <span className="hidden md:inline font-semibold text-charcoal-900 max-w-[100px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden sm:block" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        onClick={() => setUserDropdownOpen(false)}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-float border border-charcoal-200 py-1.5 text-xs font-sans z-50 animate-slide-up"
                      >
                        <div className="px-4 py-2.5 border-b border-charcoal-100 bg-warmWhite/50">
                          <p className="font-bold text-charcoal-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-charcoal-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/account/profile"
                            className="flex items-center gap-2 px-4 py-2 text-charcoal-700 hover:bg-warmWhite hover:text-charcoal-950"
                          >
                            <User className="w-3.5 h-3.5 text-charcoal-400" />
                            <span>My Profile & Addresses</span>
                          </Link>
                          <Link
                            to="/account/orders"
                            className="flex items-center gap-2 px-4 py-2 text-charcoal-700 hover:bg-warmWhite hover:text-charcoal-950"
                          >
                            <Package className="w-3.5 h-3.5 text-charcoal-400" />
                            <span>My Orders</span>
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-4 py-2 text-gold font-bold hover:bg-warmWhite"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                              <span>Store Admin ERP</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-charcoal-100 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-700 hover:bg-rose-50 font-medium"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold transition border border-charcoal-300 hover:border-gold bg-white"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Expandable Drawer */}
        {searchOpen && (
          <div className="border-t border-charcoal-200 bg-warmWhite py-3 px-4 shadow-inner">
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clothing in Bidar store (e.g. Kurta, Saree, Shirt)..."
                  autoFocus
                  className="w-full pl-10 pr-20 py-2 text-xs rounded-full border border-charcoal-200 focus:outline-none focus:border-gold bg-white font-sans text-charcoal-900"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 btn-gold text-[11px] py-1 px-3.5 rounded-full uppercase tracking-wider font-semibold"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-float flex flex-col justify-between z-50">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-charcoal-100 flex items-center justify-between bg-warmWhite">
                <div>
                  <span className="font-serif text-xl font-bold tracking-[0.18em] text-charcoal-900">
                    BAGODI
                  </span>
                  <span className="block text-[8.5px] tracking-[0.25em] text-gold uppercase font-bold mt-0.5">
                    SHOPPING MALL · BIDAR
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-charcoal-400 hover:text-charcoal-900 p-1.5 rounded-md hover:bg-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1 font-sans text-xs uppercase tracking-wider text-charcoal-800">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2.5 px-3 rounded-md transition ${
                        isActive
                          ? 'bg-charcoal text-white font-semibold'
                          : 'hover:bg-warmWhite text-charcoal-800'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                <div className="pt-3 border-t border-charcoal-100 space-y-1">
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-warmWhite text-charcoal-800"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gold" />
                      <span>My Wishlist</span>
                    </span>
                    {wishlistCount > 0 && (
                      <span className="bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-warmWhite text-charcoal-800"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-charcoal-700" />
                      <span>Shopping Bag</span>
                    </span>
                    {cartCount > 0 && (
                      <span className="bg-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                {isAuthenticated && (
                  <div className="pt-3 border-t border-charcoal-100 space-y-1">
                    <Link
                      to="/account/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 rounded-md hover:bg-warmWhite text-charcoal-700"
                    >
                      Profile & Addresses
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 rounded-md hover:bg-warmWhite text-charcoal-700"
                    >
                      My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-3 rounded-md text-gold font-bold bg-gold/10"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard ERP
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer: Store Info and Login/Signout */}
            <div className="p-4 border-t border-charcoal-100 bg-warmWhite text-xs text-charcoal-600 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Shivaji Chowk, Main Market, Bidar, Karnataka 585401
                </span>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-md text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center btn-gold text-xs py-2.5 rounded-md uppercase font-bold tracking-wider"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};