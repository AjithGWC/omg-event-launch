import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedLogo from '../AnimatedLogo/AnimatedLogo';
import RegistrationForm from '../RegistrationForm';
import RudrakshaBooking from '../RudrakshaBooking/RudrakshaBooking';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white px-4 md:px-8 py-2 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <AnimatedLogo />
          <div className="flex flex-col">
            <span className="text-[#293088] text-xl md:text-2xl font-bold leading-tight">OH MY GOD</span>
            <span className="text-[#DB2424]/70 text-xs md:text-sm leading-tight">YOURS SPIRITUALLY</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-omg-red' : 'text-neutral-500 hover:text-omg-red'
            }`}
          >
            Home
          </Link>
          <Link
            to="/temples"
            className={`text-sm font-medium transition-colors ${
              isActive('/temples') ? 'text-omg-red' : 'text-neutral-500 hover:text-omg-red'
            }`}
          >
            Temples
          </Link>
          <Link
            to="/store"
            className={`text-sm font-medium transition-colors ${
              isActive('/store') ? 'text-omg-red' : 'text-neutral-500 hover:text-omg-red'
            }`}
          >
            Store
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsRegistrationOpen(true)}
            className="hidden md:block px-4 py-2 border-2 border-omg-red text-omg-red bg-white rounded hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Register for free
          </button>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="px-4 py-2 bg-omg-blue text-white rounded hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Pre-booking
          </button>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col gap-4 pt-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-gray-700 text-sm font-medium transition-colors ${
                isActive('/') ? 'text-omg-red' : 'hover:text-omg-red'
              }`}
            >
              Home
            </Link>
            <Link
              to="/temples"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-gray-700 text-sm font-medium transition-colors ${
                isActive('/temples') ? 'text-omg-red' : 'hover:text-omg-red'
              }`}
            >
              Temples
            </Link>
            <Link
              to="/store"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-gray-700 text-sm font-medium transition-colors ${
                isActive('/store') ? 'text-omg-red' : 'hover:text-omg-red'
              }`}
            >
              Store
            </Link>
            <button 
              onClick={() => {
                setIsRegistrationOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 border-2 border-omg-red text-omg-red bg-white rounded hover:bg-omg-red hover:text-white transition-colors text-sm font-medium text-left"
            >
              Register for free
            </button>
            <button 
              onClick={() => {
                setIsBookingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-omg-blue text-white rounded hover:opacity-90 transition-opacity text-sm font-medium text-left"
            >
              Pre-booking
            </button>
          </div>
        </div>
      )}

      {/* Registration Form Modal */}
      <RegistrationForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />

      {/* Rudraksha Booking Modal */}
      <RudrakshaBooking
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </nav>
  );
};

export default Navbar;

