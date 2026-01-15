import { Calendar, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#131A72] text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Content - Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Column 1: Maha Yagam */}
          <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
              Maha Yagam
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Experience the world's longest non stop pooja and the divine vibrations of the Rudhram being chanted for continual 34 hours.
            </p>
          </div>

          {/* Column 2: Event Details */}
          <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
              Event Details
            </h3>
            <div className="space-y-3">
              {/* Date and Time */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm md:text-base">
                  February 15th 8 AM - February 16th 6 PM, 2026
                </p>
              </div>
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm md:text-base">
                  Hotel Hills Convention Centre, Hosur, TN
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
              Contact Us
            </h3>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300 text-sm md:text-base">
                team@omgofficial.com
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-400/30 my-8"></div>

        {/* Footer Bottom */}
        <div className="text-center space-y-2">
          {/* Copyright */}
          <p className="text-gray-300 text-sm md:text-base">
            ©2026 Maha Yaagam Divine Experience. All rights reserved
          </p>
          {/* Spiritual Phrase */}
          <p className="text-gray-300/50 text-sm md:text-base">
            ॐ नमः शिवाय Om Namah Shivaya
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

