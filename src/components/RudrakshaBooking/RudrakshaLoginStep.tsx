import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";
import { Phone, Loader2, Gem, X } from "lucide-react";
import rudrakshaImage from "../../assets/rudraksha-divine.jpg";
import { generalPostFunction } from "../../utils/commonFun";
import video1 from "../../assets/video1.mp4";

interface RudrakshaLoginStepProps {
  onVerified: (phoneNumber: string, userId: string) => void;
  onCancel: () => void;
  showHeader?: boolean;
}

const RudrakshaLoginStep = ({ onVerified, onCancel, showHeader = false }: RudrakshaLoginStepProps) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOtp = async () => {
    const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian mobile number pattern
    if (
      !phoneNumber ||
      phoneNumber.length !== 10 ||
      !phoneRegex.test(phoneNumber)
    ) {
      toast({
        title: "Invalid phone number",
        description:
          "Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9",
        variant: "destructive",
      });
      return;
    }
    setIsOtpLoading(true);
    try {
      const payload = {
        phoneNumber: `+91${phoneNumber}`,
        templateId: "SEND_OTP",
        channel: "whatsapp",
      };
      const response = await generalPostFunction(
        "/auth/whatsapp/otp",
        payload,
        undefined,
        "https://omg-identity-service-993414851442.asia-south1.run.app"
      );
      if (response.status === 200 || response.status === 201) {
        setIsOtpSent(true);
        setCountdown(60); // Start 1 minute countdown
        toast({
          title: "OTP Sent!",
          description: "Please enter the OTP sent to your phone",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isOtpSent) {
      // Countdown finished, allow resend
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown, isOtpSent]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    // Only allow if it starts with 6-9 or is empty
    if (digitsOnly === "" || /^[6-9]/.test(digitsOnly)) {
      // Limit to 10 digits
      const limitedValue = digitsOnly.slice(0, 10);
      setPhoneNumber(limitedValue);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, "");
    const limitedValue = digitsOnly.slice(0, 6);
    setOtp(limitedValue);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    }
    setIsOtpVerified(true);
    try {
      const payload = {
        phoneNumber: `+91${phoneNumber}`,
        otp: otp,
        channel: "whatsapp",
      };
      interface VerifyOtpInnerData {
        accessToken: string;
        user: {
          id: string;
        };
      }

      const response = await generalPostFunction<{ data: VerifyOtpInnerData }>(
        "/auth/whatsapp/verify",
        payload,
        undefined,
        "https://omg-identity-service-993414851442.asia-south1.run.app"
      );
      console.log("response", response);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", response.data?.data?.accessToken);
        const trimmedPhone = phoneNumber.trim();
        const userId = response.data?.data?.user?.id;
        if (userId) {
          onVerified(trimmedPhone, userId);
          toast({
            title: "OTP Verified!",
            description: "You can now proceed to the next step",
          });
        } else {
          throw new Error("User ID not found in response");
        }
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosError.response?.status === 401 || axiosError.response?.status === 400) {
          toast({
            title: "Error",
            description: axiosError.response?.data?.message || "Authentication failed",
            variant: "destructive",
          });
          }
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsOtpVerified(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row overflow-hidden w-full md:flex-1 md:h-full relative">
      {/* Left side - Video background (hidden on mobile, visible on desktop) */}
      <div className="hidden md:block relative w-full md:w-1/2 h-full overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/50 md:via-black/30 md:to-transparent rounded-lg -m-4 md:-m-6" />
            <div className="relative p-4 md:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Blessed Rudraksha
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-gold mb-3 leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Pre-Book Your
                <span className="block text-3xl md:text-4xl text-white mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  Sacred Bead
                </span>
              </h3>
              <p className="text-sm md:text-base text-white font-medium max-w-sm leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] mb-4">
                Experience the divine energy of Rudraksha, chanted 1 million times with sacred mantras.
              </p>
              <div className="mt-4 p-3 bg-gradient-to-r from-gold/30 via-gold/25 to-gold/20 backdrop-blur-sm rounded-lg border border-gold/50 shadow-lg">
                <p className="text-xs text-white/95 mb-1 font-semibold">Price per Rudraksha</p>
                <p className="font-display text-xl font-bold text-gold drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">₹999</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form (full width on mobile) */}
      <div className="flex w-full md:w-1/2 flex-col bg-white md:border-l md:border-gray-200 md:h-full overflow-hidden relative">
        {/* Close button - top right corner */}
        {showHeader && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="overflow-y-auto px-4 md:px-6 py-4 md:flex-1 md:overflow-y-auto">
          <div className="space-y-6 md:space-y-4 max-w-md mx-auto">
            {/* Header */}
            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E32C26] border border-gray-300 px-3 py-1.5 md:py-1 mb-4">
                <Gem className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm md:text-xs md:font-medium">Pre-Book Blessed Rudraksha</span>
              </div>
              
              {/* Sub-header */}
              <h3 className="font-display text-2xl md:text-xl font-bold text-black">
                Login with Mobile
              </h3>
            </div>

            <div className="space-y-6 md:space-y-4">
              <div className="space-y-3 md:space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-black flex items-center gap-1.5 text-base md:text-sm font-medium"
                >
                  <Phone className="w-4 h-4 md:w-4 text-gold" /> Mobile Number
                </Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-1 items-center rounded-md border border-gray-300 bg-white px-3 h-12 md:h-10">
                    <span className="text-base md:text-sm text-gray-600 pr-3 md:pr-2 border-r border-gray-300">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:border-0 focus:border-0 text-black text-base md:text-sm h-auto flex-1 shadow-none placeholder:text-gray-400"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSendOtp}
                    disabled={isOtpLoading || countdown > 0}
                    className="h-12 md:h-10 px-6 md:px-4 text-base md:text-sm whitespace-nowrap w-full sm:w-auto bg-red-600 text-white hover:bg-red-700"
                  >
                    {isOtpLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 md:mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : isOtpSent ? (
                      "Resend OTP"
                    ) : (
                      "Get OTP"
                    )}
                  </Button>
                </div>
              </div>

              {isOtpSent && (
                <div className="space-y-4 md:space-y-3 animate-in fade-in">
                  <Label htmlFor="otp" className="text-black text-base md:text-sm font-medium">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    className="bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black text-lg md:text-base h-12 md:h-10 text-center tracking-widest placeholder:text-gray-400"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <Button
                    size="sm"
                    className="w-full h-12 md:h-10 text-base md:text-sm bg-red-600 text-white hover:bg-red-700"
                    onClick={handleVerifyOtp}
                    disabled={isOtpVerified || otp.length === 0}
                  >
                    {isOtpVerified && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isOtpVerified ? "Verifying..." : "Verify & Continue"}
                  </Button>
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                className="w-full h-12 md:h-10 text-base md:text-sm mt-4 md:mt-0 bg-[#131A72] text-white border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RudrakshaLoginStep;

