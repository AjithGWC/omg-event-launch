import React from "react";
import { useNavigate } from "react-router-dom";
import templeCloudImage from "../../assets/templeCloud.png";
import swastikaSymbol from "../../assets/swastika-symbol.svg";
import Footer from "../../components/Footer/Footer";
import templeListingData from "../../data/templeListing.json";

// Import temple images
import somnathTemple from "../../assets/temple-img/somnath-temple.png";
import kashiTemple from "../../assets/temple-img/kashi-temple.jpg";
import kedarnath from "../../assets/temple-img/kedarnath.png";
import badrinathTemple from "../../assets/temple-img/badrinath-temple.png";
import ramanathaswamyTemple from "../../assets/temple-img/ramanathaswamy-temple.png";
// import meenakshiAmmanTemple from "../../assets/temple-img/meenakshi-amman-temple.png";
import meenakshiAmmanTemple from "../../assets/temple-img/meenakshi-amman-temple.jpg";
import jagannathTemplePuri from "../../assets/temple-img/jagannath-temple-puri.png";
import dwarikadashiTemple from "../../assets/temple-img/dwarikadashi-temple.png";
import vaishnoDevi from "../../assets/temple-img/vaishno-devi.webp";
import shabarimalaTemple from "../../assets/temple-img/shabarimala-temple.jpg";
import goldenTemple from "../../assets/temple-img/golden-temple.jpg";
import akshardhamaTemple from "../../assets/temple-img/akshardhama-temple.jpg";
import tiruvannamalaiArunachaleswararTemple from "../../assets/temple-img/tiruvannamalai-arunachaleswarar-temple.jpg";
import kamakhyaTemple from "../../assets/temple-img/kamakhya-temple.jpg";
import lingarajaTemple from "../../assets/temple-img/lingaraja-temple.jpg";
import mahakaleshwarTemple from "../../assets/temple-img/mahakaleshwar-temple.jpg";
import brihadeeswararTemple from "../../assets/temple-img/brihadeeswarar-temple.jpg";
import chidambaramNatarajaTemple from "../../assets/temple-img/chidambaram-nataraja-temple.jpg";
import kalighatTemple from "../../assets/temple-img/kalighat-temple.jpg";
import iskconTempleVrindavan from "../../assets/temple-img/ISKCON-temple-vrindavan.jpg";

// Default placeholder image (using one of the existing images as fallback)
const defaultImage = somnathTemple;

// Image mapping object
const imageMap: { [key: string]: string } = {
  "kashi-vishwanath.jpg": kashiTemple, // Placeholder until image is added
  "somnath-temple.png": somnathTemple,
  "kedarnath.png": kedarnath,
  "badrinath-temple.png": badrinathTemple,
  "ramanathaswamy-temple.png": ramanathaswamyTemple,
  // "meenakshi-amman-temple.png": meenakshiAmmanTemple,
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

// --- Types ---
interface TempleListing {
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

interface Temple {
  id: number;
  title: string;
  description: string;
  location: string;
  status: "Darshan Available" | "Closed" | "Crowded";
  image: string;
}

// Transform JSON data to component format
const transformTempleData = (data: TempleListing[]): Temple[] => {
  return data.map((temple) => ({
    id: temple.id,
    title: temple.name,
    description: temple.description,
    location: temple.location,
    status: "Darshan Available" as const, // Default status, can be updated based on business logic
    image: imageMap[temple.image] || defaultImage,
  }));
};

const temples: Temple[] = transformTempleData(templeListingData as TempleListing[]);

const Temples: React.FC = () => {
  const navigate = useNavigate();

  // Get full temple data for navigation
  const getFullTempleData = (templeId: number) => {
    return (templeListingData as TempleListing[]).find(t => t.id === templeId);
  };

  const handleTempleClick = (temple: Temple) => {
    const fullTempleData = getFullTempleData(temple.id);
    if (fullTempleData) {
      // Map the image filename to the actual imported image
      const templeWithImage = {
        ...fullTempleData,
        image: imageMap[fullTempleData.image] || defaultImage,
      };
      navigate(`/temples/${temple.id}`, { state: templeWithImage });
    }
  };

  return (
    <div className="w-full font-sans bg-gray-50">
      {/* --- HERO SECTION --- */}
      {/* Changed h-screen to h-[500px] or h-[60vh] to stop it from being full height */}
      <section className="relative w-full h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${templeCloudImage})` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center text-white mt-10">
          <div className="flex items-center gap-2 mb-4">
          <img
              src={swastikaSymbol}
              alt="Swastika"
              className="w-[14px] h-[14px] text-white invert brightness-0 filter"
            />
            <span className="font-montserrat font-semibold text-[11px] md:text-sm leading-5 tracking-[2px] uppercase text-white text-center w-full h-5 opacity-100">
            Where Faith Meets Timeless Devotion
            </span>
          </div>

          <h1 className="font-montserrat font-semibold text-[28px] md:text-[40px] leading-[100%] tracking-normal uppercase text-center text-white w-full max-w-[580px] h-[49px] opacity-100 mb-4">
          Sacred Temples of India
          </h1>

          <p className="font-montserrat font-normal text-sm leading-[23px] tracking-normal text-center text-white w-full max-w-[578px] h-[46px] opacity-100 mx-auto mb-10 md:mb-8">
          Discover revered temples across India that preserve ancient rituals, divine energy, and centuries of spiritual heritage.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-4 mb-8 text-[11px] md:text-xs font-semibold text-white tracking-wider">
            {[
              "Temple significance",
              "Darshan timings",
              "Biggest highlight",
              "Peak crowd & festivals",
              "Nearest access",
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <span>{item}</span>
                {i !== arr.length - 1 && (
                  <span className="block w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 px-8 rounded shadow-lg transition transform hover:scale-105">
            Pre-Book Now
          </button> */}
        </div>
      </section>

      {/* --- LISTING SECTION --- */}
      <section className="py-16 md:py-20 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-2">
          Top Sacred Temples of India
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Top Sacred Temples of India
          </h2>
          <p className="text-gray-500 font-light">
          Witness devotion across the country’s holiest sites
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {temples.map((temple) => (
            // Added p-4 padding to the card container
            <div 
              key={temple.id} 
              onClick={() => handleTempleClick(temple)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 group cursor-pointer"
            >
              
              {/* Image is now a direct child with rounded corners */}
              <img 
                src={temple.image} 
                alt={temple.title} 
                className="w-full h-56 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
              />
              
              {/* Status Badge - Moved below image */}
              {/* <div className="mt-3 mb-2">
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                    ${temple.status === 'Darshan Available' ? 'bg-indigo-100 text-indigo-800' : ''}
                    ${temple.status === 'Closed' ? 'bg-red-100 text-red-800' : ''}
                    ${temple.status === 'Crowded' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {temple.status}
                  </span>
              </div> */}

              {/* Card Content - Padding removed here as it's on the parent */}
              <div className="pt-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{temple.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3 font-light">
                  {temple.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-bold text-red-600">{temple.location}</span>
                  </div>

                  <div className="text-red-400 group-hover:translate-x-1 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Temples;
