import { useState } from 'react';
import StoreHeroSectionImage from '../assets/storeHeroSection.jpg';
import Footer from '../components/Footer/Footer';
import RudrakshaBooking from '../components/RudrakshaBooking/RudrakshaBooking';
import rudrakshVideo from '../assets/rudraksha-video.mp4';
import templeImage from '../assets/home-mobile-temple-image.png';
import { Shield, Sparkle } from 'lucide-react';

const Store = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[330px] md:h-[330px] lg:h-[400px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={StoreHeroSectionImage}
            alt="Spiritual merchandise"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4 md:px-8 max-w-4xl mx-auto">
            {/* Top Subtitle with Swastika */}
            <p className="text-white text-sm md:text-base font-medium uppercase tracking-wide mb-4">
              <span className="text-white text-lg md:text-xl mr-2">卐</span>
              BLESSED & VERIFIED PRODUCTS
            </p>

            {/* Main Heading */}
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase mb-6 leading-tight">
              SACRED ITEMS FOR YOUR SPIRITUAL JOURNEY
            </h1>

            {/* Descriptive Subheading */}
            <p className="text-white text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover authentic spiritual merchandise blessed by renowned pandits
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-8 md:px-12 py-3 md:py-4 bg-red-600 text-white rounded-lg md:rounded-xl font-semibold text-base md:text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              Pre-Book Blessed Rudraksha
            </button>

          </div>
        </div>
      </section>

      {/* The Rudraksh Recharged Section */}
      <section className="relative bg-[#1a1a1a] min-h-[550px] md:min-h-[600px] lg:min-h-[700px] py-4 md:py-6 lg:py-8 m-3 rounded-xl shadow-xl">
        {/* Background Video/Pattern */}
        <div className="absolute inset-0 rounded-lg overflow-hidden opacity-20">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={rudrakshVideo} type="video/mp4" />
          </video>
          {/* Speckled texture overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-3 md:px-6">
          {/* Top Section - Header */}
          <div className="text-center mb-6 md:mb-8 lg:mb-10">
            {/* Subtitle */}
            <p className="text-red-600 text-xs md:text-sm font-medium uppercase tracking-wide mb-2 md:mb-3">
              THE SPECIAL SACRED SEED
            </p>
            {/* Main Title */}
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">
              The Rudraksh Recharged
            </h2>
            {/* Description */}
            <p className="text-white/90 text-xs md:text-sm lg:text-base xl:text-lg max-w-3xl mx-auto leading-relaxed px-3">
              On Maha Shivarathri, 25 pandithars will chant Lord Shiva's name 1 million times over 34 hours, sanctifying each Rudraksh through Sri Ruddhram recited 3300 times.
            </p>
          </div>

          {/* Bottom Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-12 xl:gap-16">
            {/* Left Panel - Rudraksh Details Card */}
            <div className="relative order-2 lg:col-span-2 lg:order-1">
              <div className="bg-black/60 w-76 backdrop-blur-sm p-4 md:p-6 lg:p-7 rounded-2xl shadow-2xl border border-white/10">
                {/* Pre-Booking Price */}
                <div className="mb-4 border-2 rounded-2xl shadow-2xl text-center border-red-600 p-3 md:p-4 bg-gradient-to-br from-red-600/10 to-transparent">
                  <p className="text-white text-[10px] md:text-xs lg:text-sm mb-1.5 font-medium tracking-wide">
                    PRE-BOOKING PRICE
                  </p>
                  <div className="flex items-baseline gap-1.5 justify-center">
                    <span className="text-yellow-400 text-3xl md:text-4xl lg:text-5xl font-bold">
                      ₹999
                    </span>
                    <span className="text-white/80 text-xs md:text-sm lg:text-base">
                      /each
                    </span>
                  </div>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-white/30 my-4"></div>

                {/* Unique Features Section */}
                <div>
                  <h3 className="text-white text-base md:text-lg lg:text-xl font-bold mb-3 md:mb-4">
                    Why This Rudraksh is Unique?
                  </h3>
                  <ul className="space-y-2.5 md:space-y-3">
                    {/* Feature 1 */}
                    <li className="flex items-start gap-2.5">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl shadow-xl border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm flex-shrink-0">
                        <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
                      </div>
                      <p className="text-white text-xs md:text-sm leading-relaxed pt-0.5">
                        3400 Rudhrams & 10 Lakh Chants of Lord Shiva's name
                      </p>
                    </li>
                    {/* Feature 2 */}
                    <li className="flex items-start gap-2.5">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl shadow-xl border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm flex-shrink-0">
                        <Sparkle className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
                      </div>
                      <p className="text-white text-xs md:text-sm leading-relaxed pt-0.5">
                        Sanctified by 25 Pujaris
                      </p>
                    </li>
                    {/* Feature 3 */}
                    <li className="flex items-start gap-2.5">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl shadow-xl border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm flex-shrink-0">
                        <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
                      </div>
                      <p className="text-white text-xs md:text-sm leading-relaxed pt-0.5">
                        34 Hours of Non-Stop Pooja at Maha Yaagam
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-white/30 my-4"></div>

                {/* Call to Action Button */}
                <div className="mt-4 md:mt-6 text-center">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="w-80 px-5 md:px-6 py-2.5 md:py-3 bg-red-600 text-white rounded-2xl shadow-2xl font-bold text-xs md:text-sm lg:text-base hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Pre-Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Temple Image/Video */}
            <div className="relative order-1 lg:order-2">
              <div className="flex justify-center items-center">
                {/* Mobile: Show temple image */}
                <img
                  src={templeImage}
                  alt="Temple at sunset"
                  className="w-64 rounded-lg shadow-2xl object-cover p-3 md:p-2 lg:p-0"
                />

                {/* Gradient overlay for better visual */}
                {/* <div className="absolute w-72 h-72 rounded-2xl inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Rudraksha Booking Modal */}
      <RudrakshaBooking
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

    </div>
  );
};

export default Store;

