import { useState } from 'react';
import AnimatedLogo from '../components/AnimatedLogo/AnimatedLogo';
import Footer from '../components/Footer/Footer';
import RegistrationForm from '../components/RegistrationForm';
import RudrakshaBooking from '../components/RudrakshaBooking/RudrakshaBooking';
import shivaVideo from '../assets/shive-2.mp4';
import rudrakshVideo from '../assets/rudraksha-video.mp4';
import AIDevoteeImage from '../assets/AI-devotee.png';
import templeImage from '../assets/home-mobile-temple-image.png';
import templeCloudImage from '../assets/templeCloud.png';
import shivaRedBg from '../assets/shiva-red-bg.png';
import { Calendar, MapPin, Play, Sparkle } from 'lucide-react';

const Home = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      <section>
        {/* Main Content */}
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 relative">
            {/* Left Card - MAHA YAAGAM */}
            <div className="relative z-10 order-1 lg:order-none">
              <div className="relative shadow-2xl h-full flex flex-col">

                {/* Video Container */}
                {/* Video + Overlay Content */}
                <div
                  className="
                    relative w-full
                    rounded-2xl overflow-hidden

                    /* Responsive video sizing */
                    aspect-[16/9]
                    sm:aspect-[5/3]
                    lg:aspect-[16/10]

                    /* Ensure content always fits */
                    min-h-[620px] sm:min-h-[500px] lg:min-h-[520px] pt-3 pb-6
                  "
                >
                  {/* Video */}
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={shivaVideo} type="video/mp4" />
                  </video>

                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"></div>

                  {/* ⭐ TEXT OVER VIDEO ⭐ */}
                  <div
                    className="
                  relative z-10 flex flex-col justify-between
                  h-[260px] sm:h-[300px] md:h-[360px] lg:h-[420px] xl:h-[480px]
                  p-6 md:p-8
                "
                  >
                    {/* Top */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-omg-red text-lg">卐</span>
                        <span className="text-white text-xs uppercase tracking-widest">
                          A SPECIAL MAHA SHIVARATHRI CELEBRATION
                        </span>
                      </div>

                      <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                        MAHA YAAGAM
                      </h2>

                      <p className="text-white/80 text-sm mb-4">
                        The longest non-stop spiritual event on the planet
                      </p>

                      {/* Bottom */}
                      <div className="flex items-center justify-between mt-2 mb-8">
                      <button
                        onClick={() => setIsRegistrationOpen(true)}
                        className="
                          px-6 py-2
                          bg-omg-red text-white
                          rounded-xl
                          font-semibold
                          shadow-lg
                          ring-1 ring-white/20
                          hover:bg-[#b91c1c]
                          transition
                        "
                      >
                        Register for Free
                      </button>


                        {/* <div className="text-white text-xs text-right">
                        <p>February 2026</p>
                        <p>Hosur, TN</p>
                      </div> */}
                      </div>

                      <div className="space-y-2">
                        <p className="text-white text-sm flex gap-4 py-1">🔱 Launching Oh My God (OMG)- the 1st Al-Powered Devotee Experience Brand</p>
                        <p className="text-white text-sm flex gap-4 py-1">🔱 25 Purohits chant Rudhram 3.400 times in 34 hours</p>
                        <p className="text-white text-sm flex gap-4 py-1">🔱 Shiva's name chanted 1 million times across 100,000 Rudraksh beads</p>
                      </div>

                      <div className="w-[90%] mt-12">
                        {/* Red dotted divider */}
                        <div className="w-full border-t border-dashed border-omg-neutral-400 mb-4" />
                        <div className="flex flex-wrap justify-around items-center gap-4 text-white text-sm">
                          {/* Date */}
                          <div className="flex items-center gap-2">
                            <div className="bg-white rounded-md p-2">
                              <Calendar className="w-4 h-4 text-omg-red" />
                            </div>
                            <div>
                              <p className="font-medium">February</p>
                              <p className="font-medium">2026</p>
                            </div>
                          </div>

                          {/* Divider */}
                          <span className="hidden sm:block text-white">|</span>

                          {/* Time */}
                          <div>
                            <p className="font-medium">
                              15th – 8 AM to
                            </p>
                            <p className="font-medium">16th – 6 PM</p>
                          </div>

                          {/* Divider */}
                          <span className="hidden sm:block text-white">|</span>

                          {/* Location */}
                          <div className="flex items-center gap-2">
                            <div className="bg-white rounded-md p-2">
                              <MapPin className="w-4 h-4 text-omg-red" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Hotel Hills Convention
                                <br />
                                Centre, Hosur, TN
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Card - THE RUDRAKSH RECHARGED */}
            <div className="relative z-10 order-1 lg:order-none">
              <div className="relative shadow-2xl h-full flex flex-col rounded-2xl">

                <div
                  className="
                    relative w-full
                    rounded-2xl overflow-hidden

                    /* Responsive video sizing */
                    aspect-[16/9]
                    sm:aspect-[5/3]
                    lg:aspect-[16/10]

                    /* Ensure content always fits */
                    min-h-[600px] sm:min-h-[450px] lg:min-h-[520px] pb-3 pt-12 lg:pt-3
                  "
                >
                  {/* Video */}
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={rudrakshVideo} type="video/mp4" />
                  </video>

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-black/50" />

                  {/* ⭐ TEXT ON VIDEO ⭐ */}
                  <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-8">
                    {/* Swastika + Subtitle */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-omg-red text-lg md:text-xl">卐</span>
                      <span className="text-white text-xs md:text-sm font-medium uppercase tracking-wide">
                        OWN THIS SACRED RUDRAKSH AFTER MAHA YAAGAM
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      THE RUDRAKSH RECHARGED
                    </h2>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 max-w-2xl auto-rows-fr">
                      {[
                        "34 hours of non-stop chanting",
                        "25 Poojaries in unison",
                        "3,400 Rudram chants on Rudraksh",
                        "10 Lakh chants of Lord Shiva's name infused into every bead",
                      ].map((text, i) => {
                        const isSingleLine = i < 3; // First 3 items are single line
                        return (
                          <div
                            key={i}
                            className={`
                          flex gap-3
                          bg-black/20 backdrop-blur-md
                          p-2
                          rounded-xl
                          border border-white/30
                          shadow-xl
                          ring-1 ring-white/10
                          h-full
                          min-h-[60px]
                          ${isSingleLine ? 'items-center justify-center' : 'items-start'}
                        `}
                          >
                            <span className="text-[#22c55e] text-lg flex-shrink-0">🔱</span>
                            <p className={`text-white text-xs md:text-sm leading-relaxed ${isSingleLine ? '' : 'flex-1'}`}>
                              {text}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className='w-full flex justify-center'>
                      <div
                        className="
                        relative w-full max-w-md my-4
                        rounded-2xl
                        overflow-hidden
                        shadow-2xl
                        ring-1 ring-white/20
                        bg-black/10
                      "
                      >
                        {/* Background image with dark overlay */}
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                        >
                          <div className="absolute inset-0 bg-black/60" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 space-y-6">
                          {/* Pre-Book Button */}
                          <button
                            onClick={() => setIsBookingOpen(true)}
                            className="
                            bg-red-600 hover:bg-red-700
                            text-white font-semibold
                            px-8 py-3
                            rounded-xl
                            shadow-xl
                            ring-1 ring-white/20
                            transition
                          "
                          >
                            Pre-Book Now
                          </button>

                          {/* Text and Arrow */}
                          <div className="flex items-center justify-between">
                            <h2 className="text-white text-lg font-semibold tracking-wide">
                              BRING THIS DIVINE POWER HOME.
                            </h2>

                            {/* Arrow button */}
                            <button
                              className="
                              bg-red-600 hover:bg-red-700
                              w-10 h-10
                              rounded-full
                              shadow-xl
                              ring-1 ring-white/20
                              flex items-center justify-center
                              transition
                            "
                            >
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Logo */}
            <div className="absolute lg:top-auto md:-top-32 sm:bottom-80 lg:bottom-0 left-1/2 -translate-x-1/2 z-20 translate-y-[37rem] lg:translate-y-0">
              <div
                className="
                  bg-white flex items-center justify-center
                  overflow-hidden

                  /* Mobile & Tablet — PERFECT CIRCLE */
                  w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20
                  rounded-full

                  /* Desktop — Capsule */
                  lg:w-32 lg:h-24
                  lg:rounded-t-full lg:rounded-b-none
                  lg:pt-24 lg:pb-24
                "
              >
                {/* Mobile / Tablet */}
                <div className="block lg:hidden">
                  <AnimatedLogo size="small" />
                </div>

                {/* Desktop */}
                <div className="hidden lg:block">
                  <AnimatedLogo size="xlarge" />
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Why Choose OMG Section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 items-center">
            {/* Left Section - Temple Image */}
            <div className="order-1 lg:order-1 flex items-center justify-center">
              <img
                src={templeImage}
                alt="Temple at sunset"
                className="w-72 rounded-2xl shadow-2xl object-cover"
              />
            </div>

            {/* Right Section - Content */}
            <div className="order-2 col-span-2 lg:order-2 space-y-6 mt-12 lg:mt-0">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <img src={AIDevoteeImage} alt="AI Devotee" className="w-28 h-32 rounded-2xl" />
              </div>

              {/* Heading */}
              <h2 className="text-omg-blue text-2xl md:text-3xl font-bold text-center uppercase tracking-wide">
                WHY CHOOSE OMG
              </h2>

              {/* Main Headline */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center">
                <span className="text-black">World's 1st </span>
                <span className="text-omg-red">AI Powered </span>
                <span className="text-black">Devotee Experience Brand</span>
              </h3>

              {/* Body Text */}
              <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center">
                We offer a unique blend of digital convenience and deep-rooted tradition, ensuring every devotee feels connected, guided, and supported in their spiritual walk.
              </p>

              {/* Call-to-Action Button */}
              <div className="w-full flex justify-center">
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="px-8 py-3 border-2 border-omg-red text-omg-red bg-white rounded-lg hover:bg-omg-red hover:text-white transition-colors font-semibold text-base md:text-lg shadow-md"
                >
                  Pre-Book Blessed Rudraksha
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE OMG ECOSYSTEM Section */}
      <section>
        <div
          className="
          relative min-h-screen
          py-16 md:py-24
          mx-2 sm:mx-4
          rounded-2xl
          overflow-hidden
          bg-white
          shadow-xl
          ring-1 ring-black/10
        "
        >
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <img
              src={templeCloudImage}
              alt="Temple background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
              {/* Left Section - Title */}
              <div className="space-y-6">
                {/* Main Title */}
                <div>
                  <h2 className="text-omg-red text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
                    THE OMG ECOSYSTEM
                  </h2>
                  <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                    Transforming Spirituality Through Innovation
                  </h3>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">
                    We blend ancient wisdom with modern technology
                  </p>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">to create a seamless devotional journey.</p>
                </div>

                {/* Dotted Red Line - Visual Connection */}
                <div className="relative hidden lg:block h-96 mt-8 flex left-32">
                  {/* Line + button wrapper */}
                  <div className="relative h-full w-fit">
                    {/* Dashed vertical line using border */}
                    <div
                      className="w-[3px] lg:h-[380px] mx-auto"
                      style={{
                        backgroundImage: 'linear-gradient(to bottom, #DC2626 50%, transparent 50%)',
                        backgroundSize: '3px 12px',
                        backgroundRepeat: 'repeat-y'
                      }}
                    />

                    {/* Play button aligned to line end */}
                    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-2">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Play
                          className="w-4 h-4 text-omg-red rotate-90"
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Service Boxes */}
              <div className="relative">
                {/* AIQ Box - Full Right (1st card) */}
                <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 lg:translate-x-0">
                  <h4 className="text-omg-red text-xl md:text-2xl font-bold mb-2">AIQ</h4>

                  <div className="w-full border-t border-dashed border-white/80" />

                  <p className="text-white/80 text-sm md:text-base mt-8 mb-4">AI-powered Real-Time Darshan Management</p>
                  <ul className="space-y-2 text-white/90 text-sm md:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-omg-red mt-1">•</span>
                      <span>Live queue and waiting-time tracking through CCTV feeds.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-omg-red mt-1">•</span>
                      <span>Faster, smoother darshan experiences with reduced backlogs and irregular wait times.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-omg-red mt-1">•</span>
                      <span>Creating a world class devotee experience backed by technology.</span>
                    </li>
                  </ul>
                </div>

                {/* OMG GPT Box with Star - Right-ish Middle (2nd card) */}
                <div className="relative lg:-translate-x-40 rounded-xl mt-0">
                  {/* Golden Star Icon */}
                  <div className="absolute -left-1 z-10 -top-1 hidden lg:block">
                    <Sparkle className="w-4 h-4 text-yellow-400 -rotate-12" fill="currentColor" />
                  </div>
                  <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <h4 className="text-omg-red text-xl md:text-2xl font-bold mb-2">OMG GPT</h4>

                    <div className="w-full border-t border-dashed border-white/80" />

                    <p className="text-white/80 text-sm md:text-base mt-8 mb-4">AI Powered spiritual guide</p>
                    <ul className="space-y-2 text-white/90 text-sm md:text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-omg-red mt-1">•</span>
                        <span>A one-stop spiritual consultation hub.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-omg-red mt-1">•</span>
                        <span>Backed by hundreds of certified Chief Devotional Officers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-omg-red mt-1">•</span>
                        <span>Delivers in-depth spiritual guidance and personalized "spiritual prescriptions".</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* OMG App Box with Star - Left-ish Middle (3rd card) */}
                <div className="relative lg:-translate-x-80 rounded-xl mt-0">
                  <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10">
                    <h4 className="text-omg-red text-xl md:text-2xl font-bold mb-2">OMG App</h4>

                    <div className="w-full border-t border-dashed border-white/80" />

                    <p className="text-white/80 text-sm md:text-base mt-8 mb-4">Your Spiritual Ally</p>
                    <ul className="space-y-2 text-white/90 text-sm md:text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-omg-red mt-1">•</span>
                        <span>Your everyday spiritual gram to experience spirituality, digitally.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-omg-red mt-1">•</span>
                        <span>Learn about temples, access bookings, connect with devotees and take part in spiritual wellness sessions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-omg-red mt-1">•</span>
                        <span>Order Merchandise, take part in chanting sessions or book purohits, all at one click.</span>
                      </li>
                    </ul>
                  </div>
                  {/* Golden Star Icon */}
                  <div className="absolute -right-1 -bottom-1 hidden lg:block">
                    <Sparkle className="w-4 h-4 text-yellow-400 -rotate-12" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>

            {/* OMG SEZ Box - Full Left (4th card) */}
            <div className="bg-black/60 backdrop-blur-md p-6 lg:w-[45%] p-4 rounded-xl border border-white/10 lg:translate-x-28">
              <h4 className="text-omg-red text-xl md:text-2xl font-bold mb-2">OMG SEZ</h4>

              <div className="w-full border-t border-dashed border-white/80" />

              <p className="text-white/80 text-sm md:text-base mt-8 mb-4">The Spiritual Experience Zones</p>
              <p className="text-white/80 text-sm md:text-base mb-4">The Spiritual Experience Zones</p>
              <ul className="space-y-2 text-white/90 text-sm md:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-omg-red mt-1">•</span>
                  <span>A traveling spiritual festival across cities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-omg-red mt-1">•</span>
                  <span>Listen to vedic chants, group chanting sessions, devotional story telling sessions and bhajan jamming, all in ONE day!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-omg-red mt-1">•</span>
                  <span>Multiple experiences, one roof, a truly unique spiritual immersion.</span>
                </li>
              </ul>
            </div>

            {/* Large OMG Logo - Bottom Right */}
            {/* <div className="absolute bottom-8 right-8 hidden lg:block opacity-70">
              <div className="flex flex-col items-center">
                
                <div className="relative flex items-center justify-center gap-2">
                
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" />
                  </svg>
                
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <path d="M 20 80 L 20 20 Q 20 10 30 10 L 50 10 Q 60 10 60 20 L 60 80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 60 80 L 60 20 Q 60 10 70 10 L 80 10 Q 90 10 90 20 L 90 80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                  </svg>
                
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <path d="M 60 20 Q 20 20 20 50 Q 20 80 60 80 L 60 50 L 80 50" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-white text-sm md:text-base mt-4 text-center leading-tight">
                  OH MY GOD<br />
                  <span className="text-xs">Yours Spiritually</span>
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Pre Book Your Sacred Rudraksh Banner */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">

            {/* Image container with fixed height */}
            <div className="relative h-[330px] lg:h-[400px]">

              {/* Background Image */}
              <img
                src={shivaRedBg}
                alt="Shiva with trident"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0" />

              {/* Mandala Patterns */}
              <div className="absolute left-0 top-0 bottom-0 w-32 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(184,132,59,0.3)_50%,_transparent_80%)]" />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-32 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(184,132,59,0.3)_50%,_transparent_80%)]" />
              </div>

              {/* ⭐ CONTENT OVER IMAGE ⭐ */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 md:px-12 text-center">

                {/* Top Line */}
                <p className="text-white text-sm md:text-base uppercase tracking-wide mb-4 font-medium">
                  BRING THIS DIVINE POWER HOME.
                </p>

                {/* Main Headline */}
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                  Pre Book Your Sacred Rudraksh
                </h2>

                {/* Description */}
                <p className="text-white text-base md:text-lg lg:text-xl mb-8 max-w-3xl leading-relaxed">
                  A Rudraksh sanctified by 25 poojaries through 3,400 Rudhram recitations over 34 sacred hours. Pre book now.
                </p>

                {/* CTA */}
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="px-8 md:px-12 py-3 md:py-4 bg-[#131A72] text-white rounded-lg md:rounded-xl font-semibold text-base md:text-lg hover:bg-[#1e40af] transition-colors shadow-lg"
                >
                  Pre-Book Now
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

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

    </div>
  );
};

export default Home;

