import { Button } from "../ui/button";
import { CheckCircle, Gem } from "lucide-react";
import video1 from "../../assets/video1.mp4";

interface RudrakshaSuccessStepProps {
  rudrakshaQuantity: number;
  totalTokenAmount: number;
  participatingInEvent: boolean;
  numberOfMembers: number;
  onDone: () => void;
  showHeader?: boolean;
}

const RUDRAKSHA_PRICE = 999; // Price per Rudraksha

const RudrakshaSuccessStep = ({
  rudrakshaQuantity,
  totalTokenAmount,
  participatingInEvent,
  numberOfMembers,
  onDone,
  showHeader = false,
}: RudrakshaSuccessStepProps) => {
  return (
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden w-full h-full relative">
      {/* Left side - Video background */}
      <div className="relative w-full md:w-1/2 h-64 md:h-full overflow-hidden">
        <div className="absolute inset-0">
          <video
            src={video1}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 md:bg-gradient-to-r md:from-black/85 md:via-black/50 md:to-black/30" />
        </div>

        {/* Text on top of video */}
        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8 text-left">
          <div className="relative">
            {/* Subtle background gradient behind text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/50 md:via-black/30 md:to-transparent rounded-lg -m-4 md:-m-6" />
            
            <div className="relative p-4 md:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Booking Confirmed
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-gold mb-3 leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Om Namah Shivaya!
                <span className="block text-3xl md:text-4xl text-white mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  Your Divine Journey Begins
                </span>
              </h3>
              <p className="text-sm md:text-base text-white font-medium max-w-sm leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                Your blessed Rudraksha is secured. We will contact you with further details and delivery information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full md:w-1/2 flex-col h-full bg-white md:border-l md:border-gray-200 overflow-y-auto relative">
        {/* Close button - top right corner (hidden for success) */}
        
        <div className="px-6 py-4">
          <div className="text-center py-6 max-w-md mx-auto">
            {/* Header */}
            <div className="pt-2 mb-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 border border-gray-300 px-3 py-1 mb-4">
                <Gem className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm">Pre-Book Blessed Rudraksha</span>
              </div>
              
              {/* Sub-header */}
              <h3 className="font-display text-xl font-bold text-black">
                Booking Confirmed!
              </h3>
            </div>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-glow border border-green-300">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-gray-700 mb-4">
              Your blessed Rudraksha has been pre-booked. We will contact you
              with further details.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm mb-6 text-left">
              <p className="text-sm font-semibold text-black mb-3">Order Summary</p>
              <div className="space-y-2">
                <p className="text-black flex justify-between items-center">
                  <span>{rudrakshaQuantity || 1} Rudraksha × ₹{RUDRAKSHA_PRICE}</span>
                  <span className="font-medium">₹{(rudrakshaQuantity || 1) * RUDRAKSHA_PRICE}</span>
                </p>
                {participatingInEvent && (
                  <p className="text-gray-600 text-sm">
                    Event participation: {numberOfMembers} person(s)
                  </p>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="text-black font-semibold flex justify-between items-center">
                    <span>Amount Paid:</span>
                    <span>₹{totalTokenAmount}</span>
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={onDone} className="w-full bg-red-600 text-white hover:bg-red-700">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RudrakshaSuccessStep;

