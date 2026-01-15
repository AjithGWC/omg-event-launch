import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin,
  Calendar, 
  ArrowRight, 
  Plane, 
  Train, 
  Car, // Using Car for Road
  Quote,
  Plus
} from 'lucide-react';
import templeListingData from '../../data/templeListing.json';
import Footer from '../../components/Footer/Footer';

// --- Import Images (Same as before) ---
import somnathTemple from '../../assets/temple-img/somnath-temple.png';
import kashiTemple from '../../assets/temple-img/kashi-temple.jpg';
import kedarnath from '../../assets/temple-img/kedarnath.png';
import badrinathTemple from '../../assets/temple-img/badrinath-temple.png';
import ramanathaswamyTemple from '../../assets/temple-img/ramanathaswamy-temple.png';
// import meenakshiAmmanTemple from '../../assets/temple-img/meenakshi-amman-temple.png';
import meenakshiAmmanTemple from '../../assets/temple-img/meenakshi-amman-temple.jpg';
import jagannathTemplePuri from '../../assets/temple-img/jagannath-temple-puri.png';
import dwarikadashiTemple from '../../assets/temple-img/dwarikadashi-temple.png';
import vaishnoDevi from '../../assets/temple-img/vaishno-devi.webp';
import shabarimalaTemple from '../../assets/temple-img/shabarimala-temple.jpg';
import goldenTemple from '../../assets/temple-img/golden-temple.jpg';
import akshardhamaTemple from '../../assets/temple-img/akshardhama-temple.jpg';
import tiruvannamalaiArunachaleswararTemple from '../../assets/temple-img/tiruvannamalai-arunachaleswarar-temple.jpg';
import kamakhyaTemple from '../../assets/temple-img/kamakhya-temple.jpg';
import lingarajaTemple from '../../assets/temple-img/lingaraja-temple.jpg';
import mahakaleshwarTemple from '../../assets/temple-img/mahakaleshwar-temple.jpg';
import brihadeeswararTemple from '../../assets/temple-img/brihadeeswarar-temple.jpg';
import chidambaramNatarajaTemple from '../../assets/temple-img/chidambaram-nataraja-temple.jpg';
import kalighatTemple from '../../assets/temple-img/kalighat-temple.jpg';
import iskconTempleVrindavan from '../../assets/temple-img/ISKCON-temple-vrindavan.jpg';

// Default placeholder
const defaultImage = somnathTemple;

// Image Mapping
const imageMap: { [key: string]: string } = {
  "kashi-vishwanath.jpg": kashiTemple,
  "somnath-temple.png": somnathTemple,
  "kedarnath.png": kedarnath,
  "badrinath-temple.png": badrinathTemple,
  "ramanathaswamy-temple.png": ramanathaswamyTemple,
//   "meenakshi-amman-temple.png": meenakshiAmmanTemple,
  "meenakshi-amman-temple.jpg": meenakshiAmmanTemple,
  "jagannath-temple-puri.png": jagannathTemplePuri,
  "dwarikadashi-temple.png": dwarikadashiTemple,
  "vaishno-devi.webp": vaishnoDevi,
  "shabarimala-temple.jpg": shabarimalaTemple,
  "golden-temple.jpg": goldenTemple,
  "akshardhama-temple.jpg": akshardhamaTemple,
  "tiruvannamalai-arunachaleswarar-temple.jpg": tiruvannamalaiArunachaleswararTemple,
  "kamakhya-temple.jpg": kamakhyaTemple,
  "lingaraja-temple.jpg": lingarajaTemple,
  "mahakaleshwar-temple.jpg": mahakaleshwarTemple,
  "brihadeeswarar-temple.jpg": brihadeeswararTemple,
  "chidambaram-nataraja-temple.jpg": chidambaramNatarajaTemple,
  "kalighat-temple.jpg": kalighatTemple,
  "ISKCON-temple-vrindavan.jpg": iskconTempleVrindavan,
};

// --- Interfaces ---
interface Temple {
  id: number;
  name: string;
  location: string;
  description: string;
  significance: string[];
  timings: {
    weekdays: string;
    weekends: string;
  };
  peakCrowd: string[];
  biggestHighlight: string;
  nearestAccess: {
    airport: string;
    railway: string;
    road: string;
  };
  image: string;
  locationUrl: string;
}

const TempleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const temple = useMemo(() => {
    if (location.state) return location.state as Temple;
    if (id) {
      const templeId = parseInt(id, 10);
      const templeData = (templeListingData as Temple[]).find(t => t.id === templeId);
      if (templeData) {
        return {
          ...templeData,
          image: imageMap[templeData.image] || defaultImage,
        };
      }
    }
    return null;
  }, [id, location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!temple) return <div>Loading...</div>;

  // Extract Google Maps embed URL from iframe code or use directly
  // 
  // HOW TO ADD EMBED CODE:
  //   Option 1: Paste just the src URL
  //     - Copy the src URL from the iframe: "https://www.google.com/maps/embed?pb=..."
  //     - Paste it in templeListing.json "locationUrl" field
  //
  //   Option 2: Paste the full iframe code (will extract src automatically)
  //     - Copy the entire iframe code from Google Maps
  //     - Paste it in templeListing.json "locationUrl" field
  //     - The code will automatically extract the src URL
  //
  //   To get embed code:
  //     1. Go to Google Maps (maps.google.com) and search for the temple
  //     2. Click "Share" button > Select "Embed a map" tab
  //     3. Choose any size (container will make it responsive)
  //     4. Copy the iframe code or just the src URL
  //     5. Paste in templeListing.json "locationUrl" field
  const getMapEmbedUrl = (): string | undefined => {
    if (!temple.locationUrl || temple.locationUrl.trim() === '') {
      return undefined; // Return undefined if no embed URL provided
    }

    const locationUrl = temple.locationUrl.trim();
    
    // If it's already a direct embed URL, return it
    if (locationUrl.startsWith('https://www.google.com/maps/embed')) {
      return locationUrl;
    }
    
    // If it's a full iframe code, extract the src URL
    const iframeMatch = locationUrl.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1];
    }
    
    // If it contains the embed URL pattern, try to extract it
    const embedMatch = locationUrl.match(/(https:\/\/www\.google\.com\/maps\/embed[^\s"']+)/i);
    if (embedMatch && embedMatch[1]) {
      return embedMatch[1];
    }
    
    // Return as-is if we can't parse it (might be valid)
    return locationUrl;
  };

  const mapEmbedUrl = getMapEmbedUrl();

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* --- HEADER IMAGE BANNER --- */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-sm">
          <img 
            src={temple.image} 
            alt={temple.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* --- TITLE SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mt-6 mb-8">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-2">
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/temples')}>Temples</span> &gt; <span className="text-red-500">{temple.name}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{temple.name}</h1>
              {/* Status Pill - Mocked as 'Closed' based on design, or logic if available */}
              {/* <span className="bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full">
                Closed
              </span> */}
            </div>
            <p className="text-gray-500 mt-1 text-sm">{temple.location}</p>
          </div>
          
          {/* <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition shadow-md">
            Pre-Book your Pooja
          </button> */}
        </div>
      </div>

      {/* --- TABS NAVIGATION --- */}
      <div className="border-b border-gray-100 sticky top-0 bg-white z-20">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 md:gap-8 text-xs md:text-sm font-medium text-gray-500">
          {['Overview', 'Timings', 'Location', 'Nearest access'].map((tab) => {
            const sectionId = tab.toLowerCase().replace(/\s+/g, '-');
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  const element = document.getElementById(sectionId);
                  if (element) {
                    const offset = 100; // Offset for sticky header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-red-500 text-red-500' 
                    : 'border-transparent hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* OVERVIEW SECTION */}
        <div id="overview" className="scroll-mt-24">
          {/* 1. Highlight Box (Purple Gradient) */}
          <div className="bg-gradient-to-r from-purple-100 to-indigo-50 rounded-xl p-6 flex items-start gap-4 border border-purple-100">
            <Quote className="text-purple-300 fill-purple-300 shrink-0 rotate-180" size={24} />
            <div>
              <span className="font-bold text-gray-800 text-sm">Biggest Highlight : </span>
              <span className="text-gray-700 text-sm font-medium">{temple.biggestHighlight}</span>
            </div>
          </div>

          {/* 2. Significance List */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Significance</h3>
            <ul className="space-y-2">
              {temple.significance.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <Plus size={14} className="text-yellow-400 mt-1 shrink-0" strokeWidth={4} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Description Text */}
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            {temple.description}
          </p>

          {/* 4. Peak Crowd (Red Box) */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-100">
            <h3 className="text-sm font-bold text-red-500 mb-3">Peak Crowd / Festival</h3>
            <ul className="space-y-2">
              {temple.peakCrowd.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <Plus size={12} className="text-red-500 mt-0.5 shrink-0" strokeWidth={4} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* TIMINGS SECTION */}
        <div id="timings" className="scroll-mt-24">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Temple Timings</h3>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Weekdays Card */}
            <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Weekdays</p>
                <p className="text-xs text-gray-500">{temple.timings.weekdays}</p>
              </div>
            </div>

            {/* Weekends Card */}
            <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Weekends</p>
                <p className="text-xs text-gray-500">{temple.timings.weekends}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION SECTION */}
        <div id="location" className="scroll-mt-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-900">Travel Details</h3>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.name + " " + temple.location)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline"
            >
              Get direction <ArrowRight size={14} />
            </a>
          </div>
          <p className="text-xs text-gray-500 mb-4">The below are the travel details for the temple</p>
          
          <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
            {mapEmbedUrl ? (
              <iframe 
                title={`${temple.name} Location Map`}
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                <MapPin size={40} className="mb-2 opacity-50" />
                <span className="text-sm font-medium">Map embed URL not provided</span>
                <span className="text-xs mt-1 text-center px-4">
                  Add the Google Maps embed URL in templeListing.json
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NEAREST ACCESS SECTION */}
        <div id="nearest-access" className="scroll-mt-24 pb-12">
          <h3 className="text-sm font-bold text-gray-900 mb-6">Nearest Access</h3>
          <div className="space-y-6">
            
            {/* Airplane */}
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center text-red-500">
                <Plane size={20} />
              </div>
              <span className="text-xs font-bold text-gray-800 w-16">Airplane</span>
              <div className="flex-1 border-b border-dashed border-red-200 relative top-1 mx-2"></div>
              <span className="text-xs font-bold text-red-500 text-right">{temple.nearestAccess.airport}</span>
            </div>

            {/* Train */}
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center text-red-500">
                <Train size={20} />
              </div>
              <span className="text-xs font-bold text-gray-800 w-16">Train</span>
              <div className="flex-1 border-b border-dashed border-red-200 relative top-1 mx-2"></div>
              <span className="text-xs font-bold text-red-500 text-right">{temple.nearestAccess.railway}</span>
            </div>

            {/* Road */}
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center text-red-500">
                <Car size={20} />
              </div>
              <span className="text-xs font-bold text-gray-800 w-16">Road</span>
              <div className="flex-1 border-b border-dashed border-red-200 relative top-1 mx-2"></div>
              <span className="text-xs font-bold text-red-500 text-right">{temple.nearestAccess.road}</span>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default TempleDetailsPage;